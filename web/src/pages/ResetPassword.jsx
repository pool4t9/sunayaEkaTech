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
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const submitHandler = async (values) => {
    if (values.password != values.confirmPassword) {
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
      await axios.post("http://localhost:8080/api/user/reset-password", {
        password: values.password,
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
        <FormControl isRequired isInvalid={errors.password}>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            placeholder="Enter New password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum length should be 8" },
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors.confirmPassword}>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            Confirm New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            placeholder="Enter Confirm New password"
            {...register("confirmPassword", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum length should be 8" },
            })}
          />
          <FormErrorMessage>
            {errors.confirmPassword && errors.confirmPassword}
          </FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="teal"
          variant="outline"
          w={"7rem"}
          mt={"3%"}
          onClick={handleSubmit(submitHandler)}
          isLoading={isSubmitting}
          loadingText="Resetting"
        >
          Reset
        </Button>
      </Box>
    </>
  );
};

export default ResetPassword;
