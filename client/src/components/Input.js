const Input = (props) => {
  const data = props.data;
  return (
    <>
      <input
        name={data.name}
        type={data.type}
        value={data.value}
        onChange={(e) => data.handleChange(e)}
        autoComplete={data.autoComplete}
        placeholder={data.error !== "" ? data.error : data.placeholder}
      />
    </>
  );
};

export default Input;
