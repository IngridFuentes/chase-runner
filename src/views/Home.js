import "@passageidentity/passage-elements/passage-auth";
<<<<<<< HEAD
import '@passageidentity/passage-auth'
=======
>>>>>>> 4ed30e5721e21fa7f0ba6b89df04b0f07f401fe3

function Home() {
    return (
        <passage-auth app-id={process.env.REACT_APP_PASSAGE_APP_ID}></passage-auth>
    );
}

export default Home;