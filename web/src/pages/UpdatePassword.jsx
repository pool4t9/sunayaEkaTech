import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();

  const toast = useToast();
  const [formValues, setFormValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { oldPassword, newPassword, confirmNewPassword } = formValues;

  const changeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const user = JSON.parse(localStorage.getItem("user"));

  const submitHandler = async (e) => {
    e.preventDefault();
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
      setLoading(true);
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
    setLoading(false);
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
        <FormControl>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            Old Password
          </FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              name="oldPassword"
              onChange={changeHandler}
              value={oldPassword}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            placeholder="Enter New password"
            name="newPassword"
            onChange={changeHandler}
            value={newPassword}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
            Confirm New Password
          </FormLabel>
          <Input
            pr="4.5rem"
            type="password"
            placeholder="Enter Confirm New password"
            name="confirmNewPassword"
            onChange={changeHandler}
            value={confirmNewPassword}
          />
        </FormControl>
        <Button
          colorScheme="teal"
          variant="outline"
          w={"7rem"}
          mt={"3%"}
          onClick={submitHandler}
          isLoading={loading}
          loadingText="Updating"
        >
          Update
        </Button>
      </Box>
    </>
  );
};

export default UpdatePassword;
