# Clonk Token Deployment Script
# Uses Foundry (forge) to deploy on Base

## Prerequisites
# 1. Install Foundry: curl -L https://foundry.paradigm.xyz | bash && foundryup
# 2. Have ETH on Base in wallet G1

## Steps

### 1. Generate claim signer key (separate from deployer)
```bash
SIGNER_KEY=$(cast wallet new | grep "Private key" | awk '{print $3}')
SIGNER_ADDR=$(cast wallet address $SIGNER_KEY)
echo "Signer: $SIGNER_ADDR"
echo "Key: $SIGNER_KEY"
```

### 2. Deploy contract
```bash
cd /home/garr/projects/clonk/contracts

# Using wallet G1 private key
forge create ClonkToken \
  --rpc-url https://mainnet.base.org \
  --private-key $DEPLOYER_KEY \
  --constructor-args $SIGNER_ADDR \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

### 3. After deployment
- Set NEXT_PUBLIC_CLONK_CONTRACT in Vercel env
- Set CLAIM_SIGNER_PRIVATE_KEY in Vercel env
- Deploy to Vercel: `vercel --prod`

### 4. Deploy token via Clanker (alternative)
Post on Farcaster: "@clanker deploy $CLONK called Clonk - The Daily Clonk Machine"
This creates the token + Uniswap pool automatically.
Then use that contract address instead.
