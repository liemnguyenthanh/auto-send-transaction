import { useWalletProvider } from "../contexts/WalletProvider";

export const WalletInfo = () => {
  const { walletInfo, error, transaction, formData } = useWalletProvider();
  return (
    <div className="space-y-2 flex flex-col">
      <p className="text-lg font-bold">Address: {walletInfo.address}</p>
      <p className="text-lg font-bold">Balance: {walletInfo.balance}</p>
      <p className="text-lg font-bold">Chain ID: {walletInfo.chainId}</p>

      {error && <p className="text-red-500">{error}</p>}
      {transaction && (
        <div className="flex flex-col">
          <a
            className="text-lg font-bold"
            href={`${formData.rpc}/tx/${transaction.hash}`}
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
