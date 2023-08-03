import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { personalInfoSchema } from "@/types";
interface PersonalDetailsProps {
  nextStep: () => void;
};

export default function PersonalDetailsTab({ nextStep }: PersonalDetailsProps): JSX.Element {

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold text-center text-black">Personal Details</h1>
      <div className="py-2 w-full">Images upload goes here</div>
      <button onClick={() => nextStep()}>Next</button>
    </div>
  )
};
