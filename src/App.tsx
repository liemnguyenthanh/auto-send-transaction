import { ContractForm } from "./components/ContractForm";
import { WalletInfo } from "./components/WalletInfo";
import { WalletProvider } from "./contexts/WalletProvider";

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold mb-8 text-center">
              Smart Contract Interaction
            </h1>
            <ContractForm />
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold mb-8 text-center">
              {" "}
              Wallet Info{" "}
            </h1>
            <WalletInfo />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
