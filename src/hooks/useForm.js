import { useState } from "react";

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const new_value = type === "checkbox" ? checked : value;

    const newValues = { ...values, [name]: new_value };
    setValues(newValues);

    if (validate && touched[name]) {
      setErrors(validate(newValues));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    if (validate) {
      setErrors(validate(values));
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();

    const all_touched = {};
    Object.keys(values).forEach((key) => {
      all_touched[key] = true;
    });
    setTouched(all_touched);

    const found_errors = validate ? validate(values) : {};
    setErrors(found_errors);

    if (Object.keys(found_errors).length === 0) {
      onSubmit(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset };
}

export default useForm;
