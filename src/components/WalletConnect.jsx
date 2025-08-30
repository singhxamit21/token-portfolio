import { ConnectButton } from '@rainbow-me/rainbowkit'
import walletIcon from "../images/wallet.svg";

export default function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain
        return (
          <div>
            {connected ? (
              <button className="btn bg-primary text-white px-4 py-2 rounded-full">
                {account.displayName}
              </button>
            ) : (
              <button
                onClick={openConnectModal}
                className="flex items-center gap-2 bg-primary text-white px-2 py-1 rounded-full"
              >
                <img
                  src={walletIcon}
                  alt="Wallet icon"
                  loading="lazy"
                  width={20}
                  height={20}
                  className="inline-block"
                />
                <span className="text-black">Connect Wallet</span>
              </button>

            )}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
