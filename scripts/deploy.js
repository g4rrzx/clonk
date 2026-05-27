const solc = require('solc');
const fs = require('fs');
const path = require('path');
const { createWalletClient, createPublicClient, http, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { base } = require('viem/chains');

const DEPLOYER_KEY = process.env.DEPLOYER_KEY;
const SIGNER_ADDRESS = '0x4E1c41B8c9a11121CC9c46e73203fa48af951843';

if (!DEPLOYER_KEY) {
  console.error('Set DEPLOYER_KEY env var');
  process.exit(1);
}

// Compile contract
function compile() {
  const contractPath = path.join(__dirname, '../contracts/ClonkToken.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'ClonkToken.sol': { content: source },
    },
    settings: {
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } },
      optimizer: { enabled: true, runs: 200 },
    },
  };

  // Resolve imports
  function findImports(importPath) {
    const npmPath = path.join(__dirname, '../node_modules', importPath);
    if (fs.existsSync(npmPath)) {
      return { contents: fs.readFileSync(npmPath, 'utf8') };
    }
    return { error: `File not found: ${importPath}` };
  }

  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  if (output.errors) {
    const errors = output.errors.filter(e => e.severity === 'error');
    if (errors.length > 0) {
      console.error('Compilation errors:', errors.map(e => e.message).join('\n'));
      process.exit(1);
    }
  }

  const contract = output.contracts['ClonkToken.sol']['ClonkToken'];
  return {
    abi: contract.abi,
    bytecode: '0x' + contract.evm.bytecode.object,
  };
}

async function deploy() {
  console.log('Compiling ClonkToken...');
  const { abi, bytecode } = compile();
  console.log('Compiled. Bytecode size:', bytecode.length / 2, 'bytes');

  const account = privateKeyToAccount(DEPLOYER_KEY);
  console.log('Deployer:', account.address);

  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log('Balance:', (Number(balance) / 1e18).toFixed(6), 'ETH');

  if (balance < parseEther('0.001')) {
    console.error('Insufficient balance. Need at least 0.001 ETH on Base.');
    process.exit(1);
  }

  // Deploy
  console.log('Deploying with signer:', SIGNER_ADDRESS);
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [SIGNER_ADDRESS],
  });

  console.log('Tx hash:', hash);
  console.log('Waiting for confirmation...');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Contract deployed at:', receipt.contractAddress);
  console.log('Gas used:', receipt.gasUsed.toString());
  console.log('');
  console.log('=== NEXT STEPS ===');
  console.log('1. Set Vercel env: NEXT_PUBLIC_CLONK_CONTRACT=' + receipt.contractAddress);
  console.log('2. Set Vercel env: CLAIM_SIGNER_PRIVATE_KEY=0xb7c31960d5264bc8fb34917f3a48b13b71e0cd9cda7d20e80e79482db84acd88');
  console.log('3. Redeploy: npx vercel --prod');

  // Save deployment info
  fs.writeFileSync(path.join(__dirname, '../deployment.json'), JSON.stringify({
    contract: receipt.contractAddress,
    deployer: account.address,
    signer: SIGNER_ADDRESS,
    chain: 'base',
    chainId: 8453,
    txHash: hash,
    blockNumber: receipt.blockNumber.toString(),
  }, null, 2));
}

deploy().catch(console.error);
