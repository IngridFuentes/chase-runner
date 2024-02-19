import '@passageidentity/passage-elements/passage-profile';

const Profile = () => {
  return (
      <div>
        <passage-profile app-id={process.env.REACT_APP_PASSAGE_APP_ID}></passage-profile>
      </div>
  );
}
export default Profile;