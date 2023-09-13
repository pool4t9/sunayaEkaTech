import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validate } from "../helper";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [formValues, setFormValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { password, confirmPassword } = formValues;

  const changeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const tempError = validate(formValues);
    setErrors(tempError);
    if (Object.values(tempError).includes(true)) return;
    if (password != confirmPassword) {
      toast({
        title: "Invalid password",
        description: " New Password and Confirm Password are not matched",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/user/reset-password", {
        password,
        token: searchParams.get("token"),
      });
      toast({
        title: "Password Update",
        description: "Your Profile Password updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
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
    setLoading(false);
  };

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Reset Your Profile Password
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
        <FormControl isInvalid={errors.passwordError}>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            placeholder="Enter New password"
            name="password"
            onChange={changeHandler}
            value={password}
          />
          <FormErrorMessage>Password is required</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.confirmPasswordError}>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            Confirm New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            placeholder="Enter Confirm New password"
            name="confirmPassword"
            onChange={changeHandler}
            value={confirmPassword}
          />
          <FormErrorMessage>Confirm password is required</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="teal"
          variant="outline"
          w={"7rem"}
          mt={"3%"}
          onClick={submitHandler}
          isLoading={loading}
          loadingText="Resetting"
        >
          Reset
        </Button>
      </Box>
    </>
  );
};

export default ResetPassword;
