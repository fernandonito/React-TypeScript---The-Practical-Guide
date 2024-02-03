type InputProps = {
  label: string
  id: string
}

export default function Input({ id, label }: InputProps) {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </p>
  )
}
