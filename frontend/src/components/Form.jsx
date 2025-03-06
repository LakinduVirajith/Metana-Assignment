import { Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import InputField from "./InputField";
import FileUpload from "./FileUpload";
import { validationSchema } from "../validations/formSchema";
import axios from "axios";

const Form = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("cv", data.cv[0]);
        
        try {
            const response = await axios.post("http://localhost:5000/submit", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success("Form submitted successfully!");
                reset();
            }
        } catch (error) {
            toast.error("Submission failed. Please try again.");
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
            <FileUpload register={register("cv")} error={errors.cv} setValue={setValue} name="cv" />

            <Button colorScheme="blue" size="md" width="full" type="submit">
                Submit
            </Button>
        </form>
    );
};

export default Form;
