
interface PreferencesDetailsProps {
  prevStep: () => void;
};

export default function PreferencesDetailsTab({ prevStep }: PreferencesDetailsProps): JSX.Element {

  return (
    <div>PreferencesDetailsTab
      <div>
        <button onClick={() => prevStep()}>Prev</button>
      </div>
    </div>
  )
};
