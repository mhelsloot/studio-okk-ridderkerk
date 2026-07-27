import type {ArrayOfObjectsInputProps} from 'sanity'

// Sanity caps each Portable Text block ("pt-block") at a fixed reading width
// (640px) regardless of how wide the surrounding dialog is. Scope an override
// to just this field so the "Tekst" body fills the wider table/blocks dialog.
export function WideTextInput(props: ArrayOfObjectsInputProps) {
  return (
    <div className="wide-text-input">
      <style>{'.wide-text-input .pt-block { max-width: 100% !important; }'}</style>
      {props.renderDefault(props)}
    </div>
  )
}
