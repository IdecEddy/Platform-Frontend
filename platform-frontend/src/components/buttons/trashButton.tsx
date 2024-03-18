import { useContext } from "react";
import { IconTrashLight } from "../icons/icons";
import { api } from "~/trpc/react";
import { TrashButtonProps } from "~/types/config";
import { DataContext } from "~/app/_contexts/kubeConfData";

export function TrashButton({authToken, databaseId} : TrashButtonProps) {
  const kubeConfData = useContext(DataContext)
  const getconfs = api.config.getConfigsByUserId.useMutation({
    onSuccess(data, variables, context) {
      kubeConfData?.setData(data)
    },
    onError(error, variables, context) {
      console.log(error)
    },
  })
  const {mutate, error} = api.config.deleteRecordById.useMutation({
    onSuccess: () => {
      console.log("Item was removed.")
      getconfs.mutateAsync({authToken: authToken, userId: 1});
    },
    onError(error, variables, context) {
      console.log(error);        
    }
  });
  return(
    <button onClick={() => mutate({authToken: authToken, databaseId: databaseId})} className="mt-5 bg-red-500 text-white rounded-md p-2 font-bold">
      <IconTrashLight/>
    </button>
  )
}
