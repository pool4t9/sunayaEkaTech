import { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const UpdatePassword = () => {
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
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const user = JSON.parse(localStorage.getItem("user"));

  const submitHandler = async (values) => {
    const { newPassword, confirmNewPassword, oldPassword } = values;
    if (newPassword != confirmNewPassword) {
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
      await axios.post(
        "http://localhost:8080/api/user/update-password",
        {
          newPassword,
          oldPassword,
        },
        { headers: { "login-token": user?.token } }
      );
      toast({
        title: "Password Update",
        description: "Your Profile Password updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/profile");
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
        Update Password
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
        <FormControl isRequired isInvalid={errors.oldPassword}>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            Old Password
          </FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              {...register("oldPassword", {
                required: "Old Password is required",
              })}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.oldPassword && errors.oldPassword.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={errors.newPassword}>
          <FormLabel htmlFor="newPassword" fontWeight={"normal"} mt="2%">
            New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            placeholder="Enter New password"
            id="newPassword"
            {...register("newPassword", {
              required: "New Password is required",
              minLength: { value: 8, message: "Minimum length should be 8" },
            })}
          />
          <FormErrorMessage>
            {errors.newPassword && errors.newPassword.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors.confirmNewPassword}>
          <FormLabel htmlFor="confirmNewPassword" fontWeight={"normal"} mt="2%">
            Confirm New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            id="confirmNewPassword"
            placeholder="Enter Confirm New password"
            name="confirmNewPassword"
            {...register("confirmNewPassword", {
              required: "Confirm New Password is required",
              minLength: { value: 8, message: "Minimum length should be 8" },
            })}
          />
          <FormErrorMessage>
            {errors.confirmNewPassword && errors.confirmNewPassword.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="teal"
          variant="outline"
          w={"7rem"}
          mt={"3%"}
          onClick={handleSubmit(submitHandler)}
          isLoading={isSubmitting}
          loadingText="Updating"
        >
          Update
        </Button>
      </Box>
    </>
  );
};

export default UpdatePassword;
