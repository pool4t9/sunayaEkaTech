import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.length) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/user/forgot-password",
        {
          email,
        }
      );
      toast({
        title: "Forgot password link",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "BAD REQUEST",
        description: e?.response?.data?.message || e.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <FormControl id="email" isInvalid={!email}>
          <Input
            placeholder="your-email@example.com"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <FormErrorMessage>Email is required</FormErrorMessage>
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            variant="outline"
            onClick={submitHandler}
            isLoading={loading}
            loadingText="Requesting"
          >
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default ForgotPassword;
