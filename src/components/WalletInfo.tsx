import { useWalletProvider } from "../contexts/WalletProvider";

const TRANSACTION_URL = "https://bartio.beratrail.io/tx";

export const WalletInfo = () => {
  const { walletInfo, error, transaction } = useWalletProvider();
  return (
    <div className="space-y-2 flex flex-col">
      <p className="text-lg ">
        Address: <b>{walletInfo.address} </b>
      </p>
      <p className="text-lg ">
        Balance: <b>{walletInfo.balance} </b>
      </p>
      <p className="text-lg ">
        Chain ID: <b>{walletInfo.chainId} </b>
      </p>

      {error && <p className="text-red-500">{error}</p>}
      {transaction && (
        <div className="flex flex-col">
          <a
            className="text-lg font-bold text-blue-500 underline"
            href={`${TRANSACTION_URL}/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Transaction: {transaction.hash}
          </a>
          <p className="text-lg font-bold">Status: {transaction.status}</p>
        </div>
      )}
    </div>
  );
};
