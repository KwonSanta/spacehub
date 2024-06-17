import {
  Box,
  Button,
  Heading,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function SpaceOptionList() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionLists, setOptionLists] = useState([]);
  const [optionStates, setOptionStates] = useState(new Map());
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/space/option/list`)
      .then((res) => {
        const options = res.data;
        setOptionLists(options);
        const newOptionStates = new Map(options.map((option) => [option.optionListId, option.active]));
        setOptionStates(newOptionStates);
      })
      .catch((err) => {
        toast({
          title: "옵션 목록을 불러오는데 실패했습니다.",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast]);

  const handleDeleteOption = async (optionListId) => {
    try {
      await axios.delete(`/api/space/option/${optionListId}`);
      setOptionLists(optionLists.filter((option) => option.optionListId !== optionListId));
      setOptionStates((prevState) => {
        const newState = new Map(prevState);
        newState.delete(optionListId);
        return newState;
      });
      toast({
        title: "옵션이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "옵션 삭제에 실패했습니다.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSwitchChange = async (optionListId) => {
    const updatedStatus = !optionStates.get(optionListId);
    const optionToUpdate = optionLists.find((option) => option.optionListId === optionListId);

    if (optionToUpdate) {
      const updatedOption = { ...optionToUpdate, active: updatedStatus };

      try {
        await axios.put(`/api/space/option/${optionListId}`, updatedOption); // 변경된 옵션만 업데이트
        setOptionStates((prevOptionStates) => {
          const newOptionStates = new Map(prevOptionStates);
          newOptionStates.set(optionListId, updatedStatus);
          return newOptionStates;
        });
        toast({
          title: "옵션 상태가 업데이트되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "옵션 상태 업데이트에 실패했습니다.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    for (const [optionListId, isActive] of optionStates) {
      const optionToUpdate = optionLists.find((option) => option.optionListId === optionListId);

      if (optionToUpdate) {
        const updatedOption = { ...optionToUpdate, active: isActive };
        axios
          .put(`/api/space/option/${optionListId}`, updatedOption)
          .then(() => {
            toast({
              title: "옵션 상태가 업데이트되었습니다.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          })
          .catch(() => {});
      }
    }
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (optionLists.length === 0 && !isLoading) {
    return <Box>등록된 옵션이 없습니다.</Box>;
  }

  return (
    <>
      <Box>
        <Heading>option list Read Page</Heading>
      </Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>옵션명</Th>
              <Th>활성화</Th>
              <Th>삭제</Th>
            </Tr>
          </Thead>
          <Tbody>
            {optionLists.map((optionList) => (
              <Tr key={optionList.optionListId} _hover={{ bgColor: "gray.200" }}>
                <Td>{optionList.optionListId}</Td>
                <Td>{optionList.name}</Td>
                <Td>
                  <Switch
                    size="md"
                    isChecked={optionStates.get(optionList.optionListId)}
                    onChange={() => handleSwitchChange(optionList.optionListId)}
                  />
                </Td>
                <Td>
                  <Button onClick={() => handleDeleteOption(optionList.optionListId)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
