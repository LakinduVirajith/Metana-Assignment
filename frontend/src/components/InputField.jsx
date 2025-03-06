import { FormControl, Input, Text } from "@chakra-ui/react";

const InputField = ({ type, placeholder, register, error }) => {
    return (
        <FormControl marginBottom={4}>
            <Input type={type} placeholder={placeholder} {...register} isInvalid={!!error} />
            {error && <Text color="red.500" fontSize="sm" display='flex' pl={4} pt={1}>{error.message}</Text>}
        </FormControl>
    );
};

export default InputField;
