interface OtherDetailsTabProps {
  nextStep: () => void;
  prevStep: () => void;
}

export default function OtherDetailsTab({ nextStep, prevStep }: OtherDetailsTabProps): JSX.Element {
  return (
    <div>
      OtherDetailsTab
      <div>
        <button onClick={() => prevStep()}>Prev</button>
        <button onClick={() => nextStep()}>Next</button>
      </div>
    </div>
  );
}
