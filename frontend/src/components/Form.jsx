import { useState } from "react";
import { Button, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "../validations/formSchema";
import InputField from "./InputField";
import FileUpload from "./FileUpload";
import axios from "axios";
import toast from "react-hot-toast";

const Form = () => {
    const [resetTrigger, setResetTrigger] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (data) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);
        formData.append("cv", data.cv);
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_BASE_URL}/forms/submit`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success("Form submitted successfully!");
                reset();
                setResetTrigger((prev) => !prev);
            }
        } catch (error) {
            toast.error("Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onError = (errors) => {
        Object.keys(errors).reverse().forEach((field) => {
            toast.error(errors[field]?.message);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <InputField type="text" placeholder="Name" register={register("name")} error={errors.name} />
            <InputField type="email" placeholder="Email" register={register("email")} error={errors.email} />
            <InputField type="number" placeholder="Phone Number" register={register("phoneNumber")} error={errors.phoneNumber} />
            <FileUpload register={register("cv")} error={errors.cv} setValue={setValue} name="cv" resetTrigger={resetTrigger} />

            <Button colorScheme="blue" size="md" width="full" type="submit" disabled={loading} >
                {loading ? (
                    <>
                        <Spinner size="sm" color="white" />
                        <span style={{ marginLeft: "10px" }}>Submitting...</span>
                    </>
                ) : (
                    "Submit"
                )}
            </Button>
        </form>
    );
};

export default Form;
