import { ethers } from "ethers";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type FormData = {
  address: string;
  privateKey: string;
  contractAddress: string;
  abi: string;
  rpc: string;
  method: string;
  chainId: number;
  args: { [key: string]: string };
};

type WalletInfoType = {
  address: string;
  balance: number;
  chainId: number;
};

type WalletProviderType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  walletInfo: WalletInfoType;
  error: string | undefined;
  updateError: (error?: string) => void;
  transaction: TransactionType | undefined;
  updateTransaction: (transaction?: TransactionType) => void;
};

export const WalletProviderContext = createContext<
  WalletProviderType | undefined
>(undefined);

type Props = PropsWithChildren;

const DEFAULT_FORM_DATA: FormData = {
  address: "",
  privateKey: "",
  contractAddress: "",
  abi: "",
  rpc: "https://bartio.rpc.berachain.com",
  chainId: 80084,
  method: "",
  args: {},
};

export type TransactionType = {
  hash: string;
  status: "pending" | "confirming" | "confirmed" | "failed";
};

export const WalletProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [error, setError] = useState<string | undefined>(undefined);

  const [transaction, setTransaction] = useState<TransactionType | undefined>(
    undefined
  );

  const [walletInfo, setWalletInfo] = useState<WalletInfoType>({
    address: DEFAULT_FORM_DATA.address,
    balance: 0,
    chainId: DEFAULT_FORM_DATA.chainId,
  });

  const updateError = (error?: string) => {
    setError(error);
  };

  const updateTransaction = (transaction?: TransactionType) => {
    setTransaction(transaction);
  };

  useEffect(() => {
    const getWalletInfo = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(formData.rpc);
        const balance = await provider.getBalance(formData.address);
        const formattedBalance = ethers.formatEther(balance);
        setWalletInfo({
          address: formData.address,
          balance: Number(formattedBalance),
          chainId: formData.chainId,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getWalletInfo();
  }, [formData.address, formData.rpc, formData.chainId]);

  return (
    <WalletProviderContext.Provider
      value={{
        formData,
        setFormData,
        walletInfo,
        error,
        updateError,
        transaction,
        updateTransaction,
      }}
    >
      {children}
    </WalletProviderContext.Provider>
  );
};

export const useWalletProvider = () => {
  const context = useContext(WalletProviderContext);
  if (!context) {
    throw new Error("useWalletProvider must be used within a WalletProvider");
  }
  return context;
};
