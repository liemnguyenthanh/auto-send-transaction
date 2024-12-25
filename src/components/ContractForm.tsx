import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useWalletProvider } from "../contexts/WalletProvider";
import { Button } from "./Button";
import { Input } from "./Input";
import { SearchSelect } from "./Select";

type ContractAbiItem = {
  inputs: { name: string; type: string }[];
  name: string;
  outputs: { name: string; type: string }[];
  stateMutability: string;
  type: string;
};

export function ContractForm() {
  const { formData, setFormData, updateError, updateTransaction } =
    useWalletProvider();

  const [methods, setMethods] = useState<string[]>([]);
  const [inputs, setInputs] = useState<{ name: string; type: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateError();
    updateTransaction();
    setIsLoading(true);
    try {
      const { rpc, privateKey, contractAddress, abi, method, args } = formData;
      const provider = new ethers.JsonRpcProvider(rpc);

      // Create a wallet instance from the private key
      const wallet = new ethers.Wallet(privateKey, provider);

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, abi, wallet);

      //convert arfs to bigint depend on the type
      const argsArray = Object.values(args).map((arg, index) => {
        const type = inputs[index]?.type;
        if (type === "uint256") {
          return BigInt(arg);
        } else {
          return arg;
        }
      });
      console.log("argsArray", argsArray);
      const tx = await contract[method](...argsArray);
      console.log("Transaction sent:", tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      updateError(message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //validate if abi can parse to json

    if (formData.abi) {
      try {
        const contract = JSON.parse(formData.abi);
        const isArray = Array.isArray(contract);
        if (isArray) {
          const _methods = contract
            .map((item: ContractAbiItem) => item.name)
            .filter((method) => !!method);
          setMethods(_methods);
        }
      } catch (error) {
        console.error("Error:", error);
        return;
      }
    }
  }, [formData.abi]);

  useEffect(() => {
    if (formData.method) {
      const contract = JSON.parse(formData.abi);
      const inputs = contract.find(
        (method: ContractAbiItem) => method.name === formData.method
      ).inputs;
      setInputs(inputs);
    }
  }, [formData.method]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="0x..."
      />

      <Input
        label="Contract Address"
        name="contractAddress"
        value={formData.contractAddress}
        onChange={handleChange}
        placeholder="0x..."
      />

      <Input
        label="Private Key"
        name="privateKey"
        value={formData.privateKey}
        onChange={handleChange}
        placeholder="0x..."
      />

      <Input
        label="RPC URL"
        name="rpc"
        value={formData.rpc}
        onChange={handleChange}
        placeholder="https://..."
      />

      <Input
        label="Chain ID"
        name="chainId"
        value={formData.chainId}
        onChange={handleChange}
        placeholder="80084"
      />

      <Input
        label="Contract ABI"
        name="abi"
        value={formData.abi}
        onChange={handleChange}
        placeholder="[...]"
        textarea
      />

      {methods?.length > 0 && (
        <SearchSelect
          options={methods.map((method) => ({
            value: method,
            label: method,
          }))}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, method: value }))
          }
          label="Method Name"
          value={formData.method}
        />
      )}

      {inputs.map((input) => (
        <Input
          label={input.name}
          name={input.name}
          value={formData.args[input.name]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({
              ...prev,
              args: { ...prev.args, [input.name]: e.target.value },
            }))
          }
          placeholder={input.type}
        />
      ))}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Transaction"}
      </Button>
    </form>
  );
}
