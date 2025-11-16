import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
// import { UserContext } from "../context/UserContext";
import RunningShoesSpinner from "./RunningShoesSpinner";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const navigate = useNavigate();

  // Local state for managing user data
  const [profilePic, setProfilePic] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedNickname, setEditedNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Fetch user data from database when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        setLoadingUserData(true);

        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(
            `http://localhost:3000/users/${encodeURIComponent(user.sub)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();

            setUserData(data);
            setEditedName(data.name || user.name || "");
            setEditedNickname(data.nickname || user.nickname || "");

            // Handle profile picture
            if (data.picture) {
              if (typeof data.picture === "object" && data.picture.data) {
                const uint8Array = new Uint8Array(data.picture.data);
                const pictureString = new TextDecoder().decode(uint8Array);
                setProfilePic(pictureString);
              } else if (typeof data.picture === "string") {
                setProfilePic(data.picture);
              } else {
                setProfilePic(null);
              }
            } else {
              setProfilePic(null);
            }
          } else if (response.status === 404) {
            // Use Auth0 data as fallback
            setEditedName(user.name || "");
            setEditedNickname(user.nickname || "");
          }
        } catch (error) {
          // Use Auth0 data as fallback
          setEditedName(user.name || "");
          setEditedNickname(user.nickname || "");
        } finally {
          setLoadingUserData(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const goBack = () => {
    navigate(-1);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(
            user.sub
          )}/profile-picture`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              profile_picture: base64Image,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const data = await response.json();

        // Update both profilePic AND userData
        setProfilePic(base64Image);
        setUserData(data.user); // ADD THIS - Update userData with the response

        setUploading(false);
      } catch (error) {
        console.error("❌ Error uploading profile picture:", error);
        setUploadError("Failed to upload profile picture. Please try again.");
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError("Failed to read file. Please try again.");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSaveName = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:3000/users/${encodeURIComponent(user.sub)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editedName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update name");
      }

      const data = await response.json();

      setUserData(data.user);
      setIsEditingName(false);
      setSaving(false);
    } catch (error) {
      console.error("❌ Error updating name:", error);
      setSaveError("Failed to update name");
      setSaving(false);
    }
  };

  const handleSaveNickname = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:3000/users/${encodeURIComponent(user.sub)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname: editedNickname,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update nickname");
      }

      const data = await response.json();

      // Update local state
      setUserData(data.user);
      setIsEditingNickname(false);
      setSaving(false);
    } catch (error) {
      console.error("❌ Error updating nickname:", error);
      setSaveError("Failed to update nickname");
      setSaving(false);
    }
  };

  const handleCancelName = () => {
    setEditedName(userData?.name || user?.name || "");
    setIsEditingName(false);
    setSaveError(null);
  };

  const handleCancelNickname = () => {
    setEditedNickname(userData?.nickname || user?.nickname || "");
    setIsEditingNickname(false);
    setSaveError(null);
  };

  if (isLoading || loadingUserData) {
    return <RunningShoesSpinner />;
  }

  // Display values - prefer userData from database, fallback to Auth0
  const displayNickname = userData?.nickname || user?.nickname || "";
  const displayName = userData?.name || user?.name || "";

  return (
    isAuthenticated && (
      <div className={styles.profileContainer}>
        <div className={styles.backButton} onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>

        <div className={styles.profileCard}>
          {/* Header Section with Picture */}
          <div className={styles.profileHeader}>
            <div className={styles.profilePictureWrapper}>
              <img
                className={styles.profilePicture}
                src={profilePic || user.picture}
                alt={user.name}
              />
            </div>

            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              disabled={uploading}
            />
            <label htmlFor="fileInput" className={styles.uploadLabel}>
              {uploading ? "Uploading..." : "Change Photo"}
            </label>

            {uploading && (
              <div className={styles.uploadingText}>
                Uploading your photo...
              </div>
            )}
            {uploadError && (
              <div className={styles.errorText}>{uploadError}</div>
            )}
          </div>

          <div className={styles.profileDetails}>
            <p className={styles.profileEmail}>{user.email}</p>

            {saveError && <div className={styles.errorText}>{saveError}</div>}

            <ul className={styles.profileInfo}>
              <li>
                <strong>Nickname:</strong>
                {isEditingNickname ? (
                  <div className={styles.editContainer}>
                    <input
                      type="text"
                      value={editedNickname}
                      onChange={(e) => setEditedNickname(e.target.value)}
                      className={styles.editInput}
                      disabled={saving}
                    />
                    <div className={styles.editButtons}>
                      <button
                        onClick={handleSaveNickname}
                        className={styles.saveBtn}
                        disabled={saving}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={handleCancelNickname}
                        className={styles.cancelBtn}
                        disabled={saving}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.displayContainer}>
                    <span>{displayNickname}</span>
                    <button
                      onClick={() => setIsEditingNickname(true)}
                      className={styles.editBtn}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                )}
              </li>

              <li>
                <strong>Name:</strong>
                {isEditingName ? (
                  <div className={styles.editContainer}>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className={styles.editInput}
                      disabled={saving}
                    />
                    <div className={styles.editButtons}>
                      <button
                        onClick={handleSaveName}
                        className={styles.saveBtn}
                        disabled={saving}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={handleCancelName}
                        className={styles.cancelBtn}
                        disabled={saving}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.displayContainer}>
                    <span>{displayName}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className={styles.editBtn}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                )}
              </li>

              <li>
                <strong>Email:</strong> {user.email}
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
