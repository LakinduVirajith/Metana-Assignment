import React from 'react'
import { Center, Card, CardBody, Text } from "@chakra-ui/react";
import Form from "../components/Form";

function Home() {
  return (
    <Center height="100vh" bg="gray.100">
        <Card align="center" width="50vh" boxShadow="xl" borderRadius="2xl" padding="1">
            <CardBody align="center">
                <Text fontSize="4xl" fontWeight="bold" marginBottom={8}>
                    Application Form
                </Text>
                <Form />
            </CardBody>
        </Card>
    </Center>
  )
}

export default Home