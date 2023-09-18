import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();

  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (values) => {
    try {
      const { data } = await axios.post("/api/user/login", values);
      const { user, token, profileCompleted } = data.data;
      localStorage.setItem(
        "user",
        JSON.stringify({
          first_name: user.first_name,
          last_name: user.last_name,
          contact: user.contact,
          dob: user.dob,
          gender: user.gender,
          qualification: user.qualification,
          email: user.email,
          token: token,
        })
      );
      localStorage.setItem("step", profileCompleted ? 3 : 2);
      if (profileCompleted) window.location = "/profile";
      else navigate("/register");
      return;
    } catch (e) {
      toast({
        title: "BAD REQUEST",
        description: e?.response?.data?.message || e.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const user = localStorage.getItem("user") || null;

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        User Login
      </Heading>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={500}
        p={6}
        m="10px auto"
        as="form"
      >
        <FormControl mt="2%" isInvalid={errors.email}>
          <FormLabel htmlFor="email" fontWeight={"normal"}>
            Email address
          </FormLabel>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.password}>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            Password
          </FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum length should be 8" },
              })}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <Stack
          direction={{ base: "column", sm: "row" }}
          align={"start"}
          justify={"space-between"}
          mt={"2%"}
        >
          <Text as={Link} to={"/register"} color={"blue.400"}>
            New User ? Register here
          </Text>
          <Text as={Link} to={"/forgot-password"} color={"blue.400"}>
            Forgot password?
          </Text>
        </Stack>
        <Button
          colorScheme="teal"
          variant="outline"
          w={"7rem"}
          mt={"3%"}
          onClick={handleSubmit(submitHandler)}
          isLoading={isSubmitting}
          loadingText="Submitting"
        >
          Login
        </Button>
      </Box>
    </>
  );
};

export default Login;
