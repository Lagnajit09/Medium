import './landing.css';
import Button from '../../components/Button';
import Signup from '../Signup';
import Signin from '../Signin';

const programming: string[] = [
  "Programming",
  "Android Development",
  "Coding",
  "Flutter",
  "Frontend Engineering",
  "iOS Development",
  "Mobile Development",
  "Software Engineering",
  "Web Development"
];

const programmingLanguages: string[] = [
  "Angular",
  "CSS",
  "HTML",
  "Java",
  "JavaScript",
  "Nodejs",
  "Python",
  "React",
  "Ruby",
  "Typescript",
];

const dataScience: string[] = [
  "Analytics",
  "Data Engineering",
  "Data Visualization",
  "Database Design",
  "Sql",
  "DevOps",
  "AWS",
  "Databricks",
  "Docker",
  "Kubernetes",
  "Terraform"
];

const art: string[] = [
  "Comics",
  "Contemporary Art",
  "Drawing",
  "Generative Art",
  "Fine Art",
  "Illustration",
  "Painting",
  "Portraits",
  "Street Art"
];

const health: string[] = [
  "Aging",
  "Coronavirus",
  "Covid-19",
  "Death And Dying",
  "Disease",
  "Fitness",
  "Mens Health",
  "Nutrition",
  "Sleep"
];

const productivity: string[] = [
  "Career Advice",
  "Coaching",
  "Goal Setting",
  "Morning Routines",
  "Pomodoro Technique",
  "Time Management",
  "Work Life Balance",
  "Business",
  "Entrepreneurship",
  "Freelancing",
  "Small Business",
  "Startups",
  "Venture Capital"
];

interface landingPageType {
  showSignIn : boolean;
  showSignUp: boolean;
  setShowSignUp: Function;
  setShowSignIn: Function;
  setAuthenticated?: Function;
}

const Landing = ({showSignIn, showSignUp, setShowSignIn, setShowSignUp}: landingPageType) => {

  return (
    <>
    {showSignUp && !showSignIn && <Signup setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} />}
    {!showSignUp && showSignIn && <Signin setShowSignIn={setShowSignIn} setShowSignUp={setShowSignUp} />}
    <div className=" w-screen h-screen bg-gray-900 py-16 overflow-hidden relative">
      <div className="shadow-left"></div>
      <div className="shadow-right"></div>
      <Card setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} />
      <div className='flex flex-col gap-[9vh] lg:gap-[6vh]'>
      <Row data={art} colored={3} styles='float-left' bg='bg-purple-500'/>
      <Row data={programmingLanguages} colored={2} styles='float-right' bg='bg-orange-500'/>
      <Row data={health} colored={2} styles='float-left' bg='bg-yellow-400'/>
      <Row data={dataScience} colored={8} styles='float-right' bg='bg-red-500'/>
      <Row data={programming} colored={5} styles='float-left' bg='bg-green-500'/>
      <Row data={productivity} colored={7} styles='float-right' bg='bg-blue-500'/>
      </div>
    </div>
    </>
  );
};

interface NavbarPropsTypes {
  setShowSignUp: Function;
  setShowSignIn: Function;
}

export const Card = ({setShowSignIn, setShowSignUp}: NavbarPropsTypes) => {
  return (
    <div className=" absolute flex flex-col z-10 flex text-center items-center top-[20%] left-0 right-0">
      <h2 className=' w-fit text-white p-5 text-6xl backdrop-blur-lg border border-transparent rounded-t-2xl' >Human</h2>
      <h2 className=' w-fit text-white p-5 text-6xl backdrop-blur-lg border border-transparent rounded-full' >Stories and Ideas</h2>
      <p className='text-white py-4 px-3 backdrop-blur-lg border border-transparent rounded-b-xl'>A place to read, write, and deepen your understanding</p>
      <div className='flex gap-5 mt-5'>
        <Button title='Sign In' onClick={() => {setShowSignIn(true); setShowSignUp(false)}} buttonStyles=' backdrop-blur-lg text-white rounded-full bg-transparent border-white border-2 font-semibold py-4 px-6 hover:bg-white hover:text-black' />
        <Button title='Get Started' onClick={() => {setShowSignIn(false); setShowSignUp(true)}} buttonStyles=' backdrop-blur-lg text-white rounded-full bg-transparent border-white border-2 font-semibold py-4 px-6 hover:bg-white hover:text-black' />
      </div>
    </div>
  )
}

export const Row = ({ data, colored, styles, bg }: any) => {
  return (
    <div className={`sliding-row ${styles}`}>
      <div className="sliding-row-inner">
        {data.concat(data).map((item: string, index: number) => (
          <div
            key={index}
            className={`sliding-item whitespace-nowrap w-fit px-6 py-4 border-2 border-gray-900 rounded-full text-lg
              ${index % data.length === colored ? bg + ' bg-opacity-90 text-gray-100' : 'bg-gray-700 bg-opacity-50 text-gray-400'}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
