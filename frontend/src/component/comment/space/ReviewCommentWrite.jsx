import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Spacer,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";

export function ReviewCommentWrite({ spaceId, isProcessing, setIsProcessing }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [member, setMember] = useState({});
  const [isWriting, setIsWriting] = useState(false);
  const [commentList, setCommentList] = useState([]);

  const toast = useToast();
  const account = useContext(LoginContext);

  function handleClickWriteReview() {
    setIsProcessing(true);

    axios
      .postForm("/api/comment/writeReview", { spaceId, content, files })
      .then((res) => {
        setContent("");
        toast({
          status: "info",
          description: "리뷰가 작성되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
        setIsWriting(false);
        setFiles([]);
      });
  }

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listReview/${spaceId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, [isProcessing]);

  useEffect(() => {
    if (account.id) {
      axios
        .get(`/api/member/${account.id}`)
        .then((res) => {
          setMember(res.data);
        })
        .catch(() => {});
    }
  }, [account]);

  console.log(member.profileImage);

  // files 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }

  return (
    <Box border={"1px solid black"}>
      {/* 맨 윗줄 */}
      <Flex>
        <Heading as="h2" size="xl" mb={6} color="gray.700">
          REVIEW {commentList.length} 개
        </Heading>
        <Spacer />
        <Button onClick={() => setIsWriting(!isWriting)}>
          REVIEW 작성하기
        </Button>
      </Flex>

      {/* 멤버이미지, 아이디, 수정/삭제 드롭다운
          QNA 작성하기 버튼을 눌러야만 나옴 */}
      {isWriting && (
        <Box>
          <Flex>
            <Image
              border={"1px solid red"}
              borderRadius={"full"}
              w={"50px"}
              src={member.profileImage}
            />
            <Box fontSize={"2xl"}>{member.nickname}</Box>
          </Flex>

          {/* 별점, 텍스트박스, 파일첨부 등록 버튼 */}
          <Box border={"1px solid black"} m={1}>
            별점
          </Box>
          <Flex>
            <Box>
              <Textarea
                h={"80px"}
                w={"450px"}
                placeholder={
                  "사실과 관계없는 내용을 작성시 관계 법령에 따라 처벌받을 수 있습니다."
                }
                isDisabled={!account.isLoggedIn()}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {/* 파일 첨부 */}
              <Flex>
                <Input
                  p={1}
                  w={"90px"}
                  h={"35px"}
                  multiple={true}
                  type={"file"}
                  accept={"image/*"}
                  onChange={(e) => setFiles(e.target.files)}
                />
                <Box>{fileNameList}</Box>
              </Flex>
            </Box>
            <Tooltip
              label={"로그인 하세요"}
              isDisabled={account.isLoggedIn()}
              placement={"top"}
            >
              <Button
                h={"80px"}
                isDisabled={content.trim().length === 0}
                onClick={handleClickWriteReview}
              >
                등록
              </Button>
            </Tooltip>
          </Flex>
        </Box>
      )}
    </Box>
  );
}