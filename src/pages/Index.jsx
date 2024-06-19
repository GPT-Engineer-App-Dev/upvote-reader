import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Link, Input, Switch, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import axios from "axios";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("black", "white");

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStories = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const topFiveStoryIds = topStories.data.slice(0, 5);
        const storyPromises = topFiveStoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storyResponses = await Promise.all(storyPromises);
        const storiesData = storyResponses.map(response => response.data);
        setStories(storiesData);
        setFilteredStories(storiesData);
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bg={bgColor} color={textColor}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <Input placeholder="Search stories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Box alignSelf="flex-end">
          <Text display="inline" mr={2}>Dark Mode</Text>
          <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
        </Box>
        <VStack spacing={4} width="100%" overflowY="auto" maxHeight="70vh">
          {filteredStories.map(story => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%" bg={useColorModeValue("white", "gray.700")}>
              <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
              <Text>Upvotes: {story.score}</Text>
              <Link href={story.url} isExternal color="teal.500">
                Read more <FaExternalLinkAlt />
              </Link>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;