import PostsContainer from "@/components/PostsContainer";
import { LightSansSerifText, TextDefault, SmallText } from "@/components/Text";
import { H3 } from "@/components/Heading";
import { Avatar, AvatarImage } from "@/components/Avatar";
import { styled } from "@/stitches.config";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Styled components matching your app's design
const FeedContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0",
  maxWidth: "60rem",
  margin: "0 auto",
  padding: "0 1rem",
});

const PostContainer = styled("div", {
  borderBottom: "1px solid $grey300",
  paddingBottom: "2rem",
  marginBottom: "2rem",
  transition: "all 0.2s ease-in-out",
  
  "&:hover": {
    backgroundColor: "$grey100",
    borderRadius: "$500",
    padding: "1.5rem",
    marginLeft: "-1.5rem",
    marginRight: "-1.5rem",
  },
  
  "&:last-child": {
    borderBottom: "0",
  },
});

const PostHeader = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1rem",
  padding: "0 1rem",
});

const UserInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  flex: 1,
});

const PostContent = styled("div", {
  padding: "0 1rem",
  fontSize: "$md",
  lineHeight: "1.6",
  marginBottom: "1rem",
});

const PostTitle = styled("div", {
  padding: "0 1rem",
  marginBottom: "0.5rem",
});

const MediaContainer = styled("div", {
  padding: "0 1rem",
  marginBottom: "1rem",
});

const PostImage = styled("img", {
  width: "100%",
  height: "auto",
  borderRadius: "$500",
  maxHeight: "40rem",
  objectFit: "cover",
});

const StatsContainer = styled("div", {
  display: "flex",
  gap: "3rem",
  padding: "0.5rem 1rem",
  borderTop: "1px solid $grey200",
  paddingTop: "1rem",
});

const StatItem = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "$sm",
  color: "$grey400",
  cursor: "pointer",
  padding: "0.5rem",
  borderRadius: "$500",
  transition: "all 0.2s ease-in-out",
  
  "&:hover": {
    backgroundColor: "$grey200",
    color: "$grey500",
  },
});

const BASIC_FEED_QUERY = `
  query ExplorePublications {
    explorePublications(request: { 
      where: { publicationTypes: [POST] },
      orderBy: LATEST
    }) {
      items {
        ... on Post {
          id
          metadata {
            ... on TextOnlyMetadataV3 {
              content
            }
            ... on ArticleMetadataV3 {
              content
              title
            }
            ... on ImageMetadataV3 {
              content
              asset {
                image {
                  optimized {
                    uri
                  }
                }
              }
            }
            ... on VideoMetadataV3 {
              content
              asset {
                video {
                  optimized {
                    uri
                  }
                }
              }
            }
          }
          by {
            id
            handle {
              localName
              fullHandle
            }
            metadata {
              displayName
              bio
              picture {
                ... on ImageSet {
                  optimized {
                    uri
                  }
                }
              }
            }
          }
          createdAt
          stats {
            comments
            mirrors
            quotes
            reactions
          }
        }
      }
    }
  }
`;

const Home: NextPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api-v2.lens.dev', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: BASIC_FEED_QUERY,
          }),
        });

        const result = await response.json();
        console.log('Lens feed response:', result);

        if (result.errors) {
          setError(result.errors[0].message);
        } else {
          setData(result.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <LightSansSerifText>Loading Lens Protocol feed...</LightSansSerifText>;
  }

  if (error) {
    return <LightSansSerifText>Error loading feed: {error}</LightSansSerifText>;
  }

  if (!data?.explorePublications?.items?.length) {
    return <LightSansSerifText>No posts found in the feed</LightSansSerifText>;
  }

  return (
    <FeedContainer>
      {data.explorePublications.items.map((post) => {
        const profilePicture = post.by.metadata?.picture?.optimized?.uri || 
                             `https://source.boringavatars.com/marble/120/${post.by.handle?.localName || post.by.id}`;
        
        const hasImage = post.metadata?.asset?.image?.optimized?.uri;
        const hasVideo = post.metadata?.asset?.video?.optimized?.uri;
        const hasTitle = post.metadata?.title;
        
        return (
          <PostContainer key={post.id}>
            <PostHeader>
              <Avatar css={{ width: "4.5rem", height: "4.5rem" }}>
                <AvatarImage
                  src={profilePicture}
                  alt={post.by.handle?.localName || 'User'}
                />
              </Avatar>
              <UserInfo>
                <TextDefault css={{ margin: "0", fontSize: "$lg", fontWeight: "600" }}>
                  {post.by.metadata?.displayName || post.by.handle?.localName || 'Anonymous'}
                </TextDefault>
                <SmallText css={{ margin: "0", color: "$grey400" }}>
                  @{post.by.handle?.localName} • {dayjs(post.createdAt).fromNow()}
                </SmallText>
              </UserInfo>
            </PostHeader>

            {hasTitle && (
              <PostTitle>
                <H3 css={{ margin: "0", fontSize: "$xl", fontWeight: "700" }}>
                  {post.metadata.title}
                </H3>
              </PostTitle>
            )}
            
            <PostContent>
              <TextDefault css={{ margin: "0", fontSize: "$md", lineHeight: "1.6" }}>
                {post.metadata?.content || 'No content available'}
              </TextDefault>
            </PostContent>

            {hasImage && (
              <MediaContainer>
                <PostImage 
                  src={post.metadata.asset.image.optimized.uri}
                  alt="Post image"
                  loading="lazy"
                />
              </MediaContainer>
            )}

            {hasVideo && (
              <MediaContainer>
                <video 
                  controls
                  style={{ 
                    width: "100%", 
                    borderRadius: "14px",
                    maxHeight: "40rem"
                  }}
                >
                  <source src={post.metadata.asset.video.optimized.uri} />
                </video>
              </MediaContainer>
            )}
            
            <StatsContainer>
              <StatItem>
                <span>💬</span>
                <SmallText css={{ margin: "0" }}>{post.stats.comments}</SmallText>
              </StatItem>
              <StatItem>
                <span>🔄</span>
                <SmallText css={{ margin: "0" }}>{post.stats.mirrors}</SmallText>
              </StatItem>
              <StatItem>
                <span>💭</span>
                <SmallText css={{ margin: "0" }}>{post.stats.quotes}</SmallText>
              </StatItem>
              <StatItem>
                <span>❤️</span>
                <SmallText css={{ margin: "0" }}>{post.stats.reactions}</SmallText>
              </StatItem>
            </StatsContainer>
          </PostContainer>
        );
      })}
    </FeedContainer>
  );
};

export default Home;

// export async function getStaticProps() {
//   const res = await apolloClientWithoutAuth.query({
//     query: gql(EXPLORE_PUBLICATIONS),
//     variables: {
//       request: {
//         limit: 40,
//         sortCriteria: "TOP_COMMENTED",
//       },
//     },
//   });

//   return {
//     props: {
//       publications: res,
//     },
//     revalidate: 20,
//   };
// }
