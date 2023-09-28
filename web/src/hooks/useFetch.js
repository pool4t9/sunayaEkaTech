import { useState, useEffect } from "react";
import axios from "../axios";
import { useToast } from "@chakra-ui/react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    async function fetch() {
      try {
        const { data } = await axios.get(url);
        setData(data);
      } catch (e) {
        setError(
          "Something went wrong, Check your internet connection and try again"
        );
        toast({
          title: "BAD REQUEST",
          description: e?.response?.data?.message || e.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    }
    fetch(url);

  }, [toast, url]);

  return { fetchedData: data?.data, loading, error };
}

export default useFetch;
