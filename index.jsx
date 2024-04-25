import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import Home3Header from "../../Component/Headers/Home3Header";
import axios from 'axios'; // Import Axios for making HTTP requests
import { format } from 'date-fns';
import converToBase64 from '../../Component/helper/convert';
import { Table } from 'react-bootstrap';

import {

  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { course } from "../../Data/course";
import FeatureCourseCard from "../../Component/Cards/FeatureCourseCard";
import { Link } from "react-router-dom";
import GotoTop from "../../Component/GotoTop";
import React from 'react';

const Courses = [
  {
    id: 1,
    name: "Getting Started with LESS",
    date: "24/03/2020",
    grade: "50%",
    progress: "0%",
    status: "Finished",
    result: "Passed",
    link: "/",
  },
  {
    id: 2,
    name: "LMS Interactive Content",
    date: "24/03/2020",
    grade: "40%",
    progress: "0%",
    status: "Finished",
    result: "Passed",
    link: "/",
  },
  {
    id: 3,
    name: "From Zero to Hero with Nodejs",
    date: "14/04/2019",
    grade: "70%",
    progress: "0%",
    status: "running",
    result: "Failed",
    link: "/",
  },
  {
    id: 4,
    name: "Helping to change the world",
    date: "04/07/2018",
    grade: "50%",
    progress: "0%",
    status: "running",
    result: "Failed",
    link: "/",
  },
];


function StudentProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Courses");
  const [activeTable, setActiveTable] = useState("Update");
  //const [activeTable, setActiveTable] = useState("Schedule");

  const [filter, setFilter] = useState("All");
  const [activeData, setActiveData] = useState(Courses);
  const [userData, setUserData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState('');
  const [disponibilites, setDisponibilites] = useState(null); // Déclaration et initialisation de la variable disponibilites
  const [userCoursesResponse, setUserCourses] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [scheduleSessions, setScheduleSessions] = useState([]);

  const timeSlots = [
    '10:00 - 10:30',
    '10:30 - 11:00',
    '11:00 - 11:30',
    '11:30 - 12:00',
    '12:00 - 12:30',
    '12:30 - 13:00',
    '13:00 - 13:30',
    '13:30 - 14:00',
    '14:00 - 14:30',
    '14:30 - 15:00',
    '15:00 - 15:30',
    '15:30 - 16:00',
    '16:00 - 16:30',
    '16:30 - 17:00',
    '17:00 - 17:30',
    '17:30 - 18:00',
    '18:00 - 18:30',
    '18:30 - 19:00',
    '19:00 - 19:30',
    '19:30 - 20:00',
  ]

  const daySlots = [
    { name: 'Monday', value: 'monday' },
    { name: 'Tuesday', value: 'tuesday' },
    { name: 'Wednesday', value: 'wednesday' },
    { name: 'Thursday', value: 'thursday' },
    { name: 'Friday', value: 'friday' },
    { name: 'Staurday', value: 'saturday' },
    { name: 'Sinday', value: 'sunday' },
  ]

  useEffect(() => {
    if (activeTab === "Schedule") {
      getScheduleSessions(userData._id);
    }
  }, [activeTab])

  const getScheduleSessions = async (id) => {
    const TeacherParams = { params: { teacher: id } }
    //const StudentParams = { params: { student: id } }
    await axios.get(`http://localhost:5000/scheduleSessions`, TeacherParams).then(res => {
      res.data.scheduleSessions.map(() => (
        setScheduleSessions(res.data.scheduleSessions)
      ))
    }
    ).catch(err => console.log(err))
  }

  const onUpload = async e => {
    const base64 = await converToBase64(e.target.files[0]);
    setUploadedFile(base64);
  }


  const selectStyle = {
    width: '100%',
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
    lineHeight: 1.5,
    color: '#495057',
    backgroundColor: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #ced4da',
    borderRadius: '0.25rem',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
  };


  const handleCheckboxChange = (e) => {
    const slotName = e.target.name;
    const [jour, heureDebut, heureFin] = slotName.split('_').slice(0, 3);
    const isChecked = e.target.checked;

    setSelectedSlots(prevSelectedSlots => {
      if (isChecked) {
        const newSlot = { jour, heureDebut, heureFin };
        console.log('Slot added:', newSlot);
        return [...prevSelectedSlots, newSlot];
      } else {
        const filteredSlots = prevSelectedSlots.filter(slot => !(slot.jour === jour && slot.heureDebut === heureDebut && slot.heureFin === heureFin));
        console.log('Slot removed:', { jour, heureDebut, heureFin });
        return filteredSlots;
      }
    });
  };

  // Utilisez selectedSlots pour effectuer les opérations nécessaires, comme les stocker dans une base de données.
  // console.log('Selected slots:', selectedSlots);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userDataResponse = await axios.get('http://localhost:5000/api/userToken', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userId = userDataResponse.data._id; // Utilise `_id` comme ID de l'utilisateur
          const disponibilitesResponse = await axios.get(`http://localhost:5000/disponibilte/getByUser/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('UserData:', userDataResponse.data);
          console.log('Disponibilites:', disponibilitesResponse.data);

          setUserData(userDataResponse.data);
          setDisponibilites(disponibilitesResponse.data);
          // Maintenant, récupérer les détails des cours associés à cet utilisateur
          const userCoursesResponse = await axios.get(`http://localhost:5000/api/${userDataResponse.data._id}/courses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('User Courses:', userCoursesResponse.data);
          setUserCourses(userCoursesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };


    fetchUserData();
  }, []);


  const updateDisponibilites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userId = userData._id; // Récupérer l'ID de l'utilisateur depuis les données utilisateur existantes
        const requestBody = {
          selectedSlots: selectedSlots, // Envelopper selectedSlots dans un objet avec la propriété selectedSlots
        };
        const response = await axios.put(`http://localhost:5000/disponibilte/user/updateAvail/${userId}`, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Disponibilités mises à jour:', response.data);
        // Effectuez les actions nécessaires après la mise à jour des disponibilités (par exemple, afficher un message de succès)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des disponibilités:', error.message);
      // Gérez l'erreur (par exemple, afficher un message d'erreur)
    }
  };
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'msg') { // Assuming 'msg' is the name of the date input field
      // Format the date value to 'yyyy-MM-dd'
      const formattedDate = value.split('T')[0];
      setUserData(prevState => ({
        ...prevState,
        dateNaiss: formattedDate
      }));
    } else {
      setUserData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const updateUserData = {
          profile: uploadedFile || userData.profile || img1,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          address: userData.address,
          mobile: userData.mobile,
          dateNaiss: userData.dateNaiss,
          grade: userData.grade


        }
        await axios.put('http://localhost:5000/api/updateuser', updateUserData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Profil utilisateur mis à jour avec succès');
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
    }
  };

  //handle course data
  useEffect(() => {
    if (filter === "All") {
      setActiveData(Courses);
    } else if (filter === "Finished") {
      setActiveData(Courses.filter((data) => data.status === "Finished"));
    } else {
      setActiveData(Courses.filter((data) => data.result === filter));
    }
  }, [filter]);

  //handle Loading
  let content = undefined;
  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <>

        <Home3Header />

        <section className="profile-section">
          {userData && (
            <div className="container">
              <div className="row">
                <div className="col-lg-3">
                  <div className="teacher-profile">
                    <div className="teacher-thumb">
                      <img src={userData.profile || img1} alt="profile" />
                    </div>
                    <div className="teacher-meta">
                      <h5>{userData.firstName} {userData.lastName}</h5>
                      <p>{userData.role}</p>
                    </div>
                    <CardBody className="border-top p-4">
                      <div>
                        <CardSubtitle className="text-muted fs-5">Email address</CardSubtitle>
                        <CardTitle tag="h4">{userData.email}</CardTitle>

                        <CardSubtitle className="text-muted fs-5 mt-3">Gender</CardSubtitle>
                        <CardTitle tag="h4">{userData.sexe}</CardTitle>

                        <CardSubtitle className="text-muted fs-5 mt-3">Grade</CardSubtitle>
                        <CardTitle tag="h4">{userData.grade}</CardTitle>
                        <CardSubtitle className="text-muted fs-5 mt-3">Birth Date</CardSubtitle>
                        <CardTitle tag="h4">{userData.dateNaiss ? format(new Date(userData.dateNaiss), 'dd/MM/yyyy') : ''}</CardTitle>
                        <CardSubtitle className="text-muted fs-5 mt-3">Phone</CardSubtitle>
                        <CardTitle tag="h4">{userData.mobile}</CardTitle>

                        <CardSubtitle className="text-muted fs-5 mt-3">Address</CardSubtitle>
                        <CardTitle tag="h4">{userData.address}</CardTitle>


                        {/* Affichage des disponibilités */}
                        {disponibilites && (
                          <div>
                            <CardSubtitle className="text-muted fs-5 mt-3">Availibility</CardSubtitle>

                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                              {disponibilites.map((disponibilite, index) => (
                                <li key={index} style={{ marginBottom: '10px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                                  <span style={{ fontWeight: 'bold' }}>{disponibilite.jour}:</span> {disponibilite.heureDebut} - {disponibilite.heureFin}
                                </li>
                              ))}
                            </ul>

                          </div>
                        )}



                      </div>
                    </CardBody>

                  </div>
                </div>
                <div className="col-lg-9">
                  {/* Tab Title */}
                  <ul className="tab-title nav nav-tabs">

                    <li>
                      <a
                        className={activeTab === "Courses" ? "active" : ""}
                        onClick={(e) => setActiveTab(e.target.innerText)}
                      >
                        Courses
                      </a>
                    </li>
                    <li>
                      <a
                        className={activeTab === "Update" ? "active" : ""}
                        onClick={(e) => setActiveTab(e.target.innerText)}
                      >
                        Update
                      </a>
                    </li>
                    <li>
                      <a
                        className={activeTab === "Schedule" ? "active" : ""}
                        onClick={(e) => setActiveTab(e.target.innerText)}
                      >
                        Schedule
                      </a>
                    </li>
                  </ul>
                  {/* Tab Title */}
                  <div className="tab-content">
                    {activeTab === "courses" && (
                      <div className="tab-pane fade show in active">
                        <h3 className="course-title">My Courses</h3>
                        <div className="row">
                          {course.map((item) => (
                            <FeatureCourseCard
                              course={item}
                              key={item.id}
                              className="feature-course-item-4"
                            />
                          ))}
                        </div>
                      </div>
                    )}



                    {activeTab === "Update" && (
                      <div className="tab-pane fade show in active">
                        <div className="p-4">
                          <Form onSubmit={handleSubmit}>
                            <FormGroup>
                              <Label>First Name</Label>
                              <Input type="text" name="firstName" placeholder="Shaina Agrawal" value={userData.firstName} onChange={handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                              <Label>Last Name</Label>
                              <Input type="text" name="lastName" placeholder="Shaina Agrawal" value={userData.lastName} onChange={handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                              <Label>Email</Label>
                              <Input type="email" name="email" placeholder="Jognsmith@cool.com" value={userData.email} onChange={handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                              <Label>Phone No</Label>
                              <Input type="text" name="mobile" placeholder="123 456 1020" value={userData.mobile} onChange={handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                              <Label>Address</Label>
                              <Input type="textarea" name="address" value={userData.address} onChange={handleInputChange} />
                            </FormGroup>


                            <FormGroup>
                              <Label>Grade</Label><br />
                              <select name="grade" value={userData.grade} onChange={handleInputChange} style={selectStyle}>
                                <option value="Beginner">1st year (Beginner)</option>
                                <option value="2nd year">2nd year (Sophomore)</option>
                                <option value="3rd year">3rd year (Junior)</option>
                                <option value="4th year">4th year (Senior)</option>
                                <option value="5th year">5th year</option>
                                <option value="6th year">6th year</option>
                                <option value="terminal">7th year (Terminal)</option>
                              </select>
                            </FormGroup>

                            <FormGroup>
                              <Label>Date of Birth</Label>
                              <Input type="date" name="dateNaiss" value={userData.dateNaiss} onChange={handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                              <Label>Profile Picture</Label>
                              <Input type="file" name="profile" onChange={onUpload} />
                              {uploadedFile && (
                                <img src={uploadedFile} alt="Uploaded Profile" className="mt-2" />
                              )}
                            </FormGroup>
                            <Button color="primary" type="submit">Update Profile</Button>
                          </Form>

                          <Table striped bordered responsive>

                            <tbody><tr class="tr_pair" style={{ backgroundColor: '#f2f2f2' }}>
                              <th></th>
                              <th style={{ whiteSpace: 'nowrap' }}>MONDAY</th>
                              <th style={{ whiteSpace: 'nowrap' }}>TUESDAY</th>
                              <th style={{ whiteSpace: 'nowrap' }}>WEDNESDAY</th>
                              <th style={{ whiteSpace: 'nowrap' }}>THURSDAY</th>
                              <th style={{ whiteSpace: 'nowrap' }}>FRIDAY</th>
                              <th style={{ whiteSpace: 'nowrap' }}>SATURDAY</th>
                              <th style={{ whiteSpace: 'nowrap' }}>SUNDAY</th>
                            </tr>

                              <tr class="tr_impair">
                                <td >10:00-10:30</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_10:00_10:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_10:00_10:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>10:30-11:00</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_10:30_11:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_10:30_11:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>11:00-11:30</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_11:00_11:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_11:00_11:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>11:30-12:00</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_11:30_12:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_11:30_12:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>12:00-12:30</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_12:00_12:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_12:00_12:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td >12:30-13:00</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_12:30_13:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_12:30_13:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>13:00-13:30</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_13:00_13:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_13:00_13:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>13:30-14:00</td>
                                <td colSpan="5"></td>
                                <td style={{ textAlign: 'center' }}> <Input type="checkbox" name="saturday_13:30_14:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_13:30_14:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>14:00-14:30</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_14:00_14:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_14:00_14:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_14:00_14:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_14:00_14:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_14:00_14:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_14:00_14:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_14:00_14:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>14:30-15:00</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_14:30_15:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_14:30_15:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_14:30_15:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_14:30_15:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_14:30_15:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_14:30_15:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_14:30_15:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>15:00-15:30</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_15:00_15:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_15:00_15:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_15:00_15:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_15:00_15:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_15:00_15:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_15:00_15:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_15:00_15:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>15:30-16:00</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_15:30_16:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_15:30_16:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_15:30_16:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_15:30_16:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_15:30_16:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_15:30_16:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_15:30_16:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>16:00-16:30</td>
                                <td style={{ textAlign: 'center' }}>  <Input type="checkbox" name="monday_16:00_16:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_16:00_16:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_16:00_16:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_16:00_16:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_16:00_16:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_16:00_16:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_16:00_16:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>16:30-17:00</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_16:30_17:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_16:30_17:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_16:30_17:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_16:30_17:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_16:30_17:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_16:30_17:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_16:30_17:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>17:00-17:30</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_17:00_17:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_17:00_17:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_17:00_17:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_17:00_17:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_17:00_17:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_17:00_17:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_17:00_17:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>17:30-18:00</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_17:30_18:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_17:30_18:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_17:30_18:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_17:30_18:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_17:30_18:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_17:30_18:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_17:30_18:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td>18:00-18:30</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_18:00_18:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_18:00_18:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_18:00_18:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_18:00_18:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_18:00_18:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_18:00_18:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_18:00_18:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>18:30-19:00</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_18:30_19:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_18:30_19:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_18:30_19:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_18:30_19:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_18:30_19:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_18:30_19:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_18:30_19:00" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_impair">
                                <td >19:00-19:30</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_19:00_19:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_19:00_19:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_19:00_19:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_19:00_19:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_19:00_19:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_19:00_19:30" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_19:00_19:30" onChange={handleCheckboxChange} /></td>
                              </tr>
                              <tr class="tr_pair">
                                <td>19:30-20:00</td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="monday_19:30_20:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="tuesday_19:30_20:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="wednesday_19:30_20:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="thursday_19:30_20:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="friday_19:30_20:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="saturday_19:30_20:00" onChange={handleCheckboxChange} /></td>
                                <td style={{ textAlign: 'center' }}><Input type="checkbox" name="sunday_19:30_20:00" onChange={handleCheckboxChange} /></td>
                              </tr>

                            </tbody></Table>
                          <Button onClick={updateDisponibilites}>Update Availibility </Button>

                        </div>
                      </div>
                    )}

                    {activeTab === "Courses" && (
                      <div className="tab-pane fade show in active">

                        {/* Tab Content  */}
                        <div className="tab-content">
                          <div
                            className="tab-pane fade show in active"
                            id="all"
                            role="tabpanel"
                          >
                            <table className="result-table">
                              <thead>
                                { }
                                <tr>
                                  <th className="course" style={{ whiteSpace: 'nowrap' }}>Course</th>
                                  <th className="classroom" style={{ whiteSpace: 'nowrap' }}>Classroom</th>
                                  <th className="duration" style={{ whiteSpace: 'nowrap' }}>Duration</th>
                                  <th className="quizz" style={{ whiteSpace: 'nowrap' }}>Number Quizz</th>
                                  <th className="price" style={{ whiteSpace: 'nowrap' }}>Price/Year</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userCoursesResponse?.map((data) => (
                                  <tr key={data.id}>
                                    <td className="course">
                                      {data.name}
                                    </td>
                                    <td className="classroom">{data.classroom}</td>
                                    <td className="duration">{data.duration}min</td>

                                    <td className="quizz">
                                      {data.nbrQuiz}
                                    </td>
                                    <td className="price">
                                      {data.yearlyPrice} DT
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td className="show-item">
                                    Displaying 1 to {userCoursesResponse.length} of{" "}
                                    {userCoursesResponse.length} courses.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* Tab Content  */}
                      </div>
                    )}

                    {activeTab === "Schedule" && (
                      <div className="tab-pane fade show in active">

                        {/* Tab Content  */}
                        <div className="tab-content">
                          <div
                            className="tab-pane fade show in active"
                            id="all"
                            role="tabpanel"
                          >
                            <Table responsive striped>
                              <thead>
                                {/*  {daySlots?.map((day) => (
                                  <tr key={day.id}>
                                    <th className="classroom"></th>
                                    <th className="classroom">{day.name}</th>
                                  </tr>
                                ))} */}
                                <tr>
                                  <th className="classroom"></th>
                                  <th className="classroom">Monday</th>
                                  <th className="classroom" style={{ whiteSpace: 'nowrap' }}>Tuesday</th>
                                  <th className="duration" style={{ whiteSpace: 'nowrap' }}>Wedensday</th>
                                  <th className="quizz" style={{ whiteSpace: 'nowrap' }}>Thursday</th>
                                  <th className="price" style={{ whiteSpace: 'nowrap' }}>Friday</th>
                                  <th className="price" style={{ whiteSpace: 'nowrap' }}>Saturday</th>
                                  <th className="price" style={{ whiteSpace: 'nowrap' }}>Sunday</th>
                                </tr>
                              </thead>
                              <tbody>
                                {scheduleSessions?.map((session) => (

                                  timeSlots?.map((time) => (
                                    //lawej hal houni: map b td b td
                                    <tr key={time.id} scope="row">

                                    {   time == `${session.startDateTime} - ${session.endDateTime}` ?
                                        <td className="text-center bg-primary">
                                          {time}
                                        </td> :
                                        <td className="text-center">
                                          {time}
                                        </td>}
                                        
                                    {daySlots.map((day) => (
                                       
                                      day.value == session.day ?
                                        <td className="bg-primary">
                                          Class
                                        </td> :
                                        <td></td>
                                      
                                        
                                      ))}
                                    
                                  
                                    </tr>
                                  ))

                                ))}

                              </tbody>
                            </Table>
                          </div>
                        </div>
                        {/* Tab Content  */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )};
        </section>
        <Footer getStart={true} />
        <GotoTop />
      </>
    );
  }
  return content;
}

export default StudentProfile;
