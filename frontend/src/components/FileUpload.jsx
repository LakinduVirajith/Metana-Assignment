import { FormControl, FormLabel, Input, Text, Button, VStack } from "@chakra-ui/react";
import { useState } from "react";

const FileUpload = ({ register, error, setValue, name }) => {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : "");
        setValue(name, file);
    };

    return (
        <FormControl marginBottom={4} isInvalid={error}>
            <FormLabel fontWeight="medium" paddingBottom={2} paddingLeft={1}>
                Upload CV (PDF/DOCX)
            </FormLabel>
            <VStack spacing={2} align="start">
                <Button
                    as="label"
                    htmlFor="cv-upload"
                    variant="outline"
                    colorScheme="blue"
                    width="full"
                    cursor="pointer"
                >
                    {fileName || "Choose File"}
                </Button>
                <Input
                    id="cv-upload"
                    name={name}
                    type="file"
                    accept=".pdf,.docx"
                    hidden
                    onChange={handleFileChange}
                />
                {error && <Text color="red.500" fontSize="sm" pl={4} pt={1}>{error.message}</Text>}
            </VStack>
        </FormControl>
    );
};

export default FileUpload;
