import  { useState, useEffect } from "react";

const useForm = (callback, validate, initialValues = {},
    serverErrors = {}) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = event => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };
  const handleSelect = (name,value) => {
    setValues({
      ...values,
      [name]: value
    });
  };
  const handle2Select = (name1, value1, name2,value2) => {
    setValues({
      ...values,
      [name1]: value1,
      [name2]: value2
    });
  };
 
  const handleSubmit = event => {
    event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  useEffect(() => {
    if (initialValues!=null) {
      setValues(initialValues)
    }
  }, [initialValues]);
  
  useEffect(() => {
    if (serverErrors!=null) {
      setErrors(serverErrors);
    }
  }, [serverErrors]);

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    handleSelect,
    handle2Select,
  };
};

export default useForm;
