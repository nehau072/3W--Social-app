import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [liking, setLiking] = useState({});
  const [commenting, setCommenting] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // FETCH POSTS
  // =========================
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/posts"
      );

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // =========================
  // CREATE POST
  // TEXT + IMAGE
  // =========================
  const createPost = async () => {
    if (!content.trim() && !image) {
      alert("Please write something or select an image.");
      return;
    }

    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    try {
      setPosting(true);

      const formData = new FormData();

      if (content.trim()) {
        formData.append("content", content.trim());
      }

      if (image) {
        formData.append("image", image);
      }

      await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear composer
      setContent("");
      setImage(null);

      // Clear file input
      const fileInput = document.getElementById("post-image");

      if (fileInput) {
        fileInput.value = "";
      }

      // Refresh feed
      await fetchPosts();
    } catch (error) {
      console.error("Create post error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setPosting(false);
    }
  };

  // =========================
  // LIKE POST
  // =========================
  const likePost = async (postId) => {
    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    try {
      setLiking((prev) => ({
        ...prev,
        [postId]: true,
      }));

      await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchPosts();
    } catch (error) {
      console.error("Like error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to like post. Please try again."
      );
    } finally {
      setLiking((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  // =========================
  // ADD COMMENT
  // =========================
  const addComment = async (postId) => {
    const text = commentText[postId];

    if (!text?.trim()) {
      return;
    }

    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    try {
      setCommenting((prev) => ({
        ...prev,
        [postId]: true,
      }));

      await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        {
          text: text.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      await fetchPosts();
    } catch (error) {
      console.error("Comment error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add comment. Please try again."
      );
    } finally {
      setCommenting((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="social-layout">

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-icon">W</div>

            <div>
              <h1>3W Social</h1>
              <p>Connect • Share • Grow</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-item active">
              <span>⌂</span>
              Home
            </button>

            <button className="nav-item">
              <span>◉</span>
              Explore
            </button>

            <button className="nav-item">
              <span>♧</span>
              Notifications
              <b className="notification-count">3</b>
            </button>

            <button className="nav-item">
              <span>▢</span>
              Messages
            </button>

            <button className="nav-item">
              <span>♙</span>
              Profile
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-decoration">
            Better
            <br />
            Together ♡
          </div>

          <div className="join-card">
            <div className="join-icon">👥</div>

            <h3>Join the conversation</h3>

            <p>Be part of a growing community!</p>

            <button>→</button>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search posts, people, or topics..."
            />
          </div>

          <div className="top-profile">
            <span className="bell">♧</span>

            <div className="avatar small">
              {user.username?.charAt(0)?.toUpperCase() || "N"}
            </div>

            <strong>{user.username || "User"}</strong>

            <button
              onClick={logout}
              title="Logout"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "20px",
                padding: "4px 8px",
              }}
            >
              ⌄
            </button>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="content-grid">

          {/* =========================
              FEED
          ========================= */}
          <section className="feed-section">

            {/* CREATE POST */}
            <div className="create-card">

              <div className="composer-top">
                <div className="avatar">
                  {user.username?.charAt(0)?.toUpperCase() || "N"}
                </div>

                <textarea
                  placeholder={`What's on your mind, ${
                    user.username || "there"
                  }?`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      createPost();
                    }
                  }}
                />
              </div>

              {/* SELECTED IMAGE PREVIEW */}
              {image && (
                <div
                  style={{
                    margin: "10px 0",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#f5f5f5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span>
                      📷 {image.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);

                        const fileInput =
                          document.getElementById(
                            "post-image"
                          );

                        if (fileInput) {
                          fileInput.value = "";
                        }
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}

              <div className="composer-bottom">

                <div className="composer-options">

                  {/* PHOTO BUTTON */}
                  <label
                    htmlFor="post-image"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    ▧ Photo
                  </label>

                  <input
                    id="post-image"
                    type="file"
                    accept="image/*"
                    style={{
                      display: "none",
                    }}
                    onChange={(e) => {
                      const selectedFile =
                        e.target.files?.[0];

                      if (selectedFile) {
                        setImage(selectedFile);
                      }
                    }}
                  />

                  <span>▷ Video</span>

                  <span>☺ Emoji</span>

                </div>

                <button
                  className="post-button"
                  onClick={createPost}
                  disabled={posting}
                >
                  {posting ? "Posting..." : "➤ Post"}
                </button>

              </div>
            </div>

            {/* FEED TITLE */}
            <div className="feed-heading">
              <h2>Latest Posts</h2>
              <span>⌄</span>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="loading-card">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (

              /* EMPTY */
              <div className="empty-card">
                <h3>No posts yet</h3>

                <p>
                  Be the first person to share something!
                </p>
              </div>

            ) : (

              /* POSTS */
              posts.map((post) => (
                <article
                  className="post-card"
                  key={post._id}
                >

                  {/* POST USER */}
                  <div className="post-user">

                    <div className="avatar">
                      {post.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div className="user-info">

                      <div className="username-row">
                        <strong>{post.username}</strong>

                        <span className="verified">
                          ✓
                        </span>
                      </div>

                      <span>
                        @{post.username} ·{" "}
                        {post.createdAt
                          ? new Date(
                              post.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </span>

                    </div>

                    <button className="more-button">
                      •••
                    </button>

                  </div>

                  {/* POST TEXT */}
                  {post.content && (
                    <p className="post-text">
                      {post.content}
                    </p>
                  )}

                  {/* POST IMAGE */}
                  {post.image && (
                    <img
                      src={
                        post.image.startsWith("http")
                          ? post.image
                          : `http://localhost:5000${post.image}`
                      }
                      alt="Post"
                      className="post-image"
                    />
                  )}

                  {/* POST STATS */}
                  <div className="post-stats">

                    <button
                      onClick={() =>
                        likePost(post._id)
                      }
                      disabled={liking[post._id]}
                    >
                      <span className="heart">
                        ♥
                      </span>

                      {liking[post._id]
                        ? "..."
                        : post.likes?.length || 0}
                    </button>

                    <span>
                      ◯ {post.comments?.length || 0}
                    </span>

                    <span>↗</span>

                    <span className="bookmark">
                      ♧
                    </span>

                  </div>

                  {/* COMMENTS */}
                  <div className="comments-area">

                    {post.comments?.map(
                      (comment, index) => (
                        <div
                          className="comment"
                          key={index}
                        >

                          <div className="avatar tiny">
                            {comment.username
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div className="comment-content">

                            <strong>
                              {comment.username}
                            </strong>

                            <p>
                              {comment.text}
                            </p>

                          </div>

                        </div>
                      )
                    )}

                    {/* COMMENT INPUT */}
                    <div className="comment-input">

                      <div className="avatar tiny">
                        {user.username
                          ?.charAt(0)
                          ?.toUpperCase() || "N"}
                      </div>

                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={
                          commentText[post._id] || ""
                        }
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post._id]:
                              e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();
                            addComment(post._id);
                          }
                        }}
                      />

                      <button
                        onClick={() =>
                          addComment(post._id)
                        }
                        disabled={
                          commenting[post._id]
                        }
                      >
                        {commenting[post._id]
                          ? "..."
                          : "➤"}
                      </button>

                    </div>

                  </div>

                </article>
              ))
            )}

          </section>

          {/* =========================
              RIGHT SIDEBAR
          ========================= */}
          <aside className="right-sidebar">

            {/* PROFILE CARD */}
            <div className="profile-card">

              <div className="profile-cover"></div>

              <div className="profile-avatar">
                {user.username
                  ?.charAt(0)
                  ?.toUpperCase() || "N"}
              </div>

              <div className="profile-details">

                <h2>
                  {user.username || "Neha"}
                </h2>

                <p>
                  @{user.username || "neha"}
                </p>

                <div className="profile-stats">

                  <div>
                    <strong>
                      {posts.filter(
                        (post) =>
                          post.username ===
                          user.username
                      ).length}
                    </strong>

                    <span>Posts</span>
                  </div>

                  <div>
                    <strong>128</strong>
                    <span>Followers</span>
                  </div>

                  <div>
                    <strong>56</strong>
                    <span>Following</span>
                  </div>

                </div>

                <button className="edit-profile">
                  Edit Profile
                </button>

              </div>

            </div>

            {/* SUGGESTED PEOPLE */}
            <div className="side-card">

              <div className="side-title">
                <h3>Suggested People</h3>
                <span>See All</span>
              </div>

              {[
                ["Riya Sharma", "riya"],
                ["Aarav Patel", "aarav"],
                ["Sneha Verma", "sneha"],
                ["Karan Singh", "karan"],
              ].map(([name, username]) => (
                <div
                  className="suggestion"
                  key={username}
                >

                  <div className="avatar small">
                    {name.charAt(0)}
                  </div>

                  <div>
                    <strong>{name}</strong>
                    <span>@{username}</span>
                  </div>

                  <button>Follow</button>

                </div>
              ))}

            </div>

            {/* TRENDING */}
            <div className="side-card">

              <div className="side-title">
                <h3>Trending Topics</h3>
                <span>See All</span>
              </div>

              {[
                ["#3WSocial", "12.4K posts"],
                ["#GoodVibes", "8.7K posts"],
                ["#Tech", "6.1K posts"],
                ["#Life", "4.3K posts"],
                ["#Friends", "3.8K posts"],
              ].map(([topic, count]) => (
                <div
                  className="trend"
                  key={topic}
                >

                  <span className="trend-icon">
                    ♨
                  </span>

                  <div>
                    <strong>{topic}</strong>
                    <span>{count}</span>
                  </div>

                  <b>›</b>

                </div>
              ))}

            </div>

            {/* EXPLORE */}
            <div className="explore-card">

              <div className="explore-icon">
                👥
              </div>

              <h2>
                Explore More Connections
              </h2>

              <p>
                Follow people, discover new
                interests and be part of
                something amazing!
              </p>

              <button>
                Find People →
              </button>

            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}

export default Home;
