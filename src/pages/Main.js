import { useEffect, useState } from "react"

export default function Main() {
    const [studentData, setStudentData] = useState([]);
    const [clicked, setClicked] = useState([])
    const [newTagName, setNewTagName] = useState("");
    const [studentNameFilter, setStudentNameFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");
  
    async function fetchURL(url) {
        const response = await fetch(url);
        const data = await response.json();
        const students = data.students;
        students.forEach((student) => {
          student.tags = [];
        });
        setStudentData(students);
      }

      useEffect(() => {
        fetchURL(`https://api.hatchways.io/assessment/students`);
      }, []);


    const handleToggle = (id) => {
        if(clicked.includes(id)) {
            setClicked(clicked.filter(studentid => studentid !== id))
        } else {
            let newClicked = [...clicked]
            newClicked.push(id)
            setClicked(newClicked)
        }
    }

    const createTagForStudent = (student, newTag) => {
        student.tags.push(newTag);
    
        const indexOfStudent = studentData.findIndex(s => s.id === student.id);
        let studentDataWithChanges = [
          ...studentData.slice(0, indexOfStudent),
          student,
          ...studentData.slice(indexOfStudent + 1),
        ];
        setStudentData(studentDataWithChanges);
      };

      const nameFilter = (filterString) => {
        if (filterString && filterString.toLowerCase) {
          filterString = filterString.toLowerCase();
        }
        let filtered = [];
        studentData.forEach((student) => {
          const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    
          if (!filterString || fullName.includes(filterString)) {
            filtered.push(student);
          }
        });
        return filtered;
      };

      const searchTags = (tagInput) => {
        if (tagInput && tagInput.toLowerCase) {
          tagInput = tagInput.toLowerCase();
        }
    
        let searchTagsArray = [];
        studentData.forEach((student) => {
          let tagExists = false;
          student.tags.forEach((t) => {
            if (t.toLowerCase().includes(tagInput)) {
              tagExists = true;
            }
          });
    
          if (!tagInput || tagExists) {
            searchTagsArray.push(student);
          }
        });
        return searchTagsArray;
      };
    
      const filteredByNameStudents = nameFilter(studentNameFilter);
      const filteredByTagStudents = searchTags(tagFilter);
      const combinedFilteredStudents = [];

      filteredByNameStudents.forEach((student) => {
        if (filteredByTagStudents.includes(student)) {
          combinedFilteredStudents.push(student);
        }
      });

      return (
          <>
            <div className="flex h-screen justify-center items-center bg-gray-100">
                <div className="w-4/6 pt-16 h-5/6 bg-white shadow-md rounded-md overflow-y-scroll sm:no-scrollbar">
                    <div className="pb-10">
                        <form>
                                <input className="text-gray-500 text-lg ml-2 -mt-16 w-65% fixed z-10 appearance-none no-x-search leading-tight outline-none p-3 focus:border-gray-500 border-b border-gray-300 bg-white"
                                    type="search"
                                    name="search-students"
                                    placeholder="Search by name"
                                    handleSearchName={setStudentNameFilter}
                                    spellCheck="false"
                                    autocomplete="off"
                                    onChange= {(event) => setStudentNameFilter(event.target.value)}
                                />
                        </form>
                        <form>
                                <input className="text-gray-500 text-lg ml-2 -mt-4 w-65% fixed z-10 appearance-none no-x-search leading-tight outline-none p-3 focus:border-gray-500 border-b border-gray-300 bg-white"
                                    type="search"
                                    name="search-tags"
                                    placeholder="Search by tag"
                                    handleSearchTag={setTagFilter}
                                    spellCheck="false"
                                    autocomplete="off"
                                    onChange= {(event) => setTagFilter(event.target.value)}
                                />
                        </form>
                    </div>
                    {combinedFilteredStudents.map(student => (
                    <li className="flex border-solid border-b border-gray-300 pt-6 items-start justify-start pl-6 pb-3 relative" key={student.id}>
                        <div className="border-solid border border-gray-300 rounded-full">
                            <img className="w-28 rounded-full" src={student.pic} alt="student" />
                        </div>
                        <div className="pl-8">
                            <h3 className="font-bold text-2xl">{student.firstName.toUpperCase()} {student.lastName.toUpperCase()}</h3>
                        <div className="text-gray-500 pt-3 pl-4">
                            <p>Email: {student.email}</p>
                            <p>Company: {student.company}</p>
                            <p>Skill: {student.skill}</p>
                            <p>Average: {}
                            {student.grades.reduce((prevGrade, currentGrade) => parseInt(currentGrade) + prevGrade, 0) / student.grades.map(grade => grade).length} % 
                            </p>
                            {clicked.includes(student.id) ? (
                                <ul className="pt-5 pb-3">
                                    {student.grades.map((grade, index) => (
                                        <li key={grade.id}>
                                            Test {index + 1}: {grade}%
                                        </li>
                                         ))}
                                </ul> 
                            ) : null}
                            <div className="flex space-x-1 pt-2">
                                {student.tags.map(tag => 
                                <div className="inline-block w-auto bg-gray-200 text-center text-gray-500 border-1 border-gray-200 rounded p-2"
                                key={student.id + " " + tag}
                                >
                                    {tag}
                                </div>)
                                }
                            </div>
                                <input className="text-gray-500 pt-5 pb-1 mb-4 appearance-none no-x-search leading-tight outline-none focus:border-gray-500 border-b border-gray-300"
                                    placeholder="Add a tag"
                                    onChange={(event) => {
                                        setNewTagName(event.target.value);
                                      }}
                                      onKeyUp={(event) => {
                                        if (event.key === "Enter") {
                                            function saveTag() {
                                                createTagForStudent(student, newTagName);
                                              }
                                          saveTag();
                                          event.target.value = "";
                                        }
                                      }}
                                    spellCheck="false"
                                    type="text"
                                /> 
                        </div> 
                        <button
                                className="font-medium text-gray-400 text-7xl absolute top-px right-4"
								onClick={() => handleToggle(student.id)}
							>
								{clicked.includes(student.id) ? "-" : "+"}
						</button>
                        </div>
                       
                    </li>
                    ))}
                    </div>
                </div>
        </>
      );
    }
  

  


