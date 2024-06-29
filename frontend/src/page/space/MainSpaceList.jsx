import React, {useEffect, useState} from 'react';
import {Box, Grid, GridItem, Text, Button, VStack, Image, Heading, Flex, space} from "@chakra-ui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import SpaceCard from "./SpaceCard.jsx";

// import {useContext} from ".";

export function MainSpaceList() {
  const [visibleSpaces, setVisibleSpaces] = useState(10); // 초기 표시할 공간 수
  const [visibleTypes, setVisibleTypes] = useState(10); // 초기 표시할 공간 유형 수
  const [showMoreSpaces, setShowMoreSpaces] = useState(false);
  const [showMoreTypes, setShowMoreTypes] = useState(false);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // 선택된 타입 ID 상태
  const [allSpaces, setAllSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]); // 필터링된 공간 데이터를 저장할 상태 추가


  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/space/type/list')
      .then(response => {
        setSpaceTypes(response.data);
        if (response.data.length > visibleTypes) {
          setShowMoreTypes(true);
        }
      })
      .catch(error => {
        console.error('공간 유형 정보를 불러오는데 실패하였습니다:', error);
      });

    axios.get('/api/space/list')
      .then(response => {
        setAllSpaces(response.data);
        setFilteredSpaces(response.data); // 초기에는 모든 공간 데이터를 표시
        if (response.data.length > visibleSpaces) {
          setShowMoreSpaces(true);
        }
      })
      .catch(error => {
        console.error('공간 데이터를 불러오는데 실패하였습니다:', error);
      });

  }, [visibleSpaces, visibleTypes]);

  useEffect(() => {
    // selectedType 변경 시 필터링
    if (selectedType) {
      const filtered = allSpaces.filter(space => space.typeId === selectedType);
      setFilteredSpaces(filtered);
    } else {
      setFilteredSpaces(allSpaces);
    }
  }, [selectedType, allSpaces]);

  const handleShowMoreSpaces = () => {
    setVisibleSpaces(prevVisibleSpaces => prevVisibleSpaces + 10);
  };

  const handleShowMoreTypes = () => {
    setVisibleTypes(prevVisibleTypes => prevVisibleTypes + 10);
  };

  function handleCardClick(spaceId) {
    navigate(`/space/${spaceId}`);
  }

  const handleClickType = (typeId) => {
    setSelectedType(prevTypeId => (prevTypeId === typeId ? null : typeId))
  }

  return (
    <>
      <Box py={12} px={8} bg="gray.50">
        <Heading as="h2" size="xl" mb={8} textAlign="center">찾는 공간이 있나요?</Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap={8}>
          {spaceTypes.slice(0, visibleTypes).map(type => (
            <GridItem
              key={type.itemId}
              w="100%"
              textAlign="center"
              onClick={() => handleClickType(type.itemId)}
            >
              <VStack
                cursor="pointer"
                _hover={{transform: 'translateY(-5px)', transition: 'transform 0.3s'}}
                p={6}
                bg={selectedType === type.itemId ? "blue.100" : "white"} // 선택된 타입 색상 변경
                color={selectedType === type.itemId ? "white" : "gray.700"} // 선택된 타입 텍스트 색상 변경
                borderRadius="xl"
                boxShadow="lg"
              >
                <Box
                  w={16}
                  h={16}
                  bg="yellow.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="30%"
                  boxShadow="inner"
                >
                  <Image
                    src={type.iconFile?.fileName || 'http://via.placeholder.com/1000.jpg'}
                    alt={type.name}
                    objectFit="cover"
                    borderRadius=""
                    boxSize="100%"
                  />
                </Box>
                <Text fontWeight="semibold" mt={3} color="gray.700">{type.name}</Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>
        {showMoreTypes && visibleTypes < spaceTypes.length && (
          <Flex justifyContent="center" mt={10}>
            <Button onClick={handleShowMoreTypes} colorScheme="teal" size="lg" fontWeight="bold"
                    boxShadow="md">더보기</Button>
          </Flex>
        )}
      </Box>
      <Box py={10} px={5}>
        <Heading as="h2" size="lg" mb={6}>공간 목록</Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {filteredSpaces.slice(0, visibleSpaces).map(({space, spaceImgFiles}) => (
            <GridItem
              cursor="pointer"
              key={space.spaceId}
              onClick={() => {
                handleCardClick(space.spaceId)
              }}
              transition="transform 0.2s"
              _hover={{transform: 'scale(1.05)'}}
            >
              <SpaceCard
                space={space}
                thumbnailPath={spaceImgFiles && spaceImgFiles.length > 0 ? spaceImgFiles[0].fileName : null}
              />
            </GridItem>
          ))}
        </Grid>
        {showMoreSpaces && visibleSpaces < allSpaces.length && (
          <Box display="flex" justifyContent="center" mt={6}>
            <Button onClick={handleShowMoreSpaces} colorScheme="teal">더보기</Button>
          </Box>
        )}
      </Box>
    </>
  );
}

export default MainSpaceList;