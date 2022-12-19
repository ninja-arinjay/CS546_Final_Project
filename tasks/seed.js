const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const posts = data.posts;
const teamitems = data.teamItems;
const feed = data.feed;
const comments = data.comments;
const teams = data.teams;

async function createUsers() {
  return idList;
}

async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  // seed users
  const userList = [
    {
      firstName: "Raye",
      lastName: "Iacovazzi",
      email: "riacovazzi0@youtu.be",
      age: 67,
      bio: "In blandit ultrices enim.",
      location: "Mexico",
      password: "avSHKH@bIh9AGu",
    },
    {
      firstName: "Elmo",
      lastName: "Cudihy",
      email: "ecudihy1@cargocollective.com",
      age: 87,
      bio: "Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat.",
      location: "New Jersey",
      password: "h16qH@cAXi",
    },
    {
      firstName: "Charil",
      lastName: "Isakovitch",
      email: "cisakovitch2@linkedin.com",
      age: 19,
      bio: "Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam.",
      location: "New York",
      password: "c7MeHn2H@YMB",
    },
    {
      firstName: "Court",
      lastName: "Olander",
      email: "colander3@51.la",
      age: 83,
      bio: "Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo.",
      location: "California",
      password: "oQXqBbzh3H@",
    },
    {
      firstName: "Pren",
      lastName: "Castanyer",
      email: "pcastanyer4@state.gov",
      age: 85,
      bio: "Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
      location: "Outer Space",
      password: "3gej3gcyH@",
    },
    {
      firstName: "Joshua",
      lastName: "Gorman",
      email: "jgorman4@stevens.edu",
      age: 19,
      bio: "Really just chilling.",
      location: "New Jersey",
      password: "walkingHere@12AM",
    },
    {
      firstName: "Test",
      lastName: "User1",
      email: "testuser1@gmail.com",
      age: 25,
      bio: "I am a test user.",
      location: "Atlantis",
      password: "testuser1@Home",
    },
    {
      firstName: "Jennica",
      lastName: "Swabey",
      email: "jswabey0@oracle.com",
      age: 48,
      bio: "Fusce consequat.",
      location: "Washington",
      password: "bLWJzP9J0#",
    },
    {
      firstName: "Borg",
      lastName: "Ximenez",
      email: "bximenez1@google.pl",
      age: 87,
      bio: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
      location: "Washington",
      password: "rGveyak2EGufB#",
    },
    {
      firstName: "Brigit",
      lastName: "Pichan",
      email: "bpichan2@parallels.com",
      age: 20,
      bio: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.",
      location: "Texas",
      password: "HODZX270vaD#",
    },
    {
      firstName: "Giff",
      lastName: "Meineken",
      email: "gmeineken3@youtu.be",
      age: 20,
      bio: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
      location: "California",
      password: "YeDZlq2Gm#",
    },
    {
      firstName: "Josselyn",
      lastName: "Loynes",
      email: "jloynes4@unblog.fr",
      age: 37,
      bio: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.",
      location: "North Carolina",
      password: "qkQ0Gi2xq4G#",
    },
    {
      firstName: "Nicolai",
      lastName: "Padmore",
      email: "npadmore0@fda.gov",
      age: 32,
      bio: "Innovative regional implementation",
      location: "Diadema",
      password: "CYjfT177Mir@1",
    },
    {
      firstName: "Bess",
      lastName: "Kelk",
      email: "bkelk1@baidu.com",
      age: 44,
      bio: "Right-sized intermediate implementation",
      location: "Mytishchi",
      password: "hBCqiyhT9G1e@1",
    },
    {
      firstName: "Imogene",
      lastName: "Saxon",
      email: "isaxon2@1688.com",
      age: 52,
      bio: "Optional homogeneous matrices",
      location: "Fengyang Fuchengzhen",
      password: "CIS9Pe@1",
    },
    {
      firstName: "Kristal",
      lastName: "Hartles",
      email: "khartles3@cdc.gov",
      age: 60,
      bio: "Visionary web-enabled paradigm",
      location: "Ganjiangtou",
      password: "9PnaGPzfTxcs@1",
    },{
      firstName: "Aurelie",
      lastName: "Borrowman",
      email: "aborrowman4@unblog.fr",
      age: 58,
      bio: "Enterprise-wide high-level throughput",
      location: "Capljina",
      password: "lqygAGcpVe@1",
    },{
      firstName: "Eliot",
      lastName: "Gaskell",
      email: "egaskell5@myspace.com",
      age: 46,
      bio: "Business-focused regional focus group",
      location: "Thi Tran Giao",
      password: "u3MjVN@1",
    },
    {
      "firstName": "Lynsey",
      "lastName": "Junifer",
      "email": "ljunifer1k@google.de",
      "age": 27,
      "bio": "Switchable upward-trending project",
      "location": "Cajamarca",
      "password": "Jb0Gd5@1"
    }, {
      "firstName": "Cesar",
      "lastName": "Golthorpp",
      "email": "cgolthorpp1l@devhub.com",
      "age": 47,
      "bio": "Universal logistical knowledge base",
      "location": "Bantry",
      "password": "eLnnMW@1"
    }, {
      "firstName": "Kimbell",
      "lastName": "Thoma",
      "email": "kthoma1m@moonfruit.com",
      "age": 46,
      "bio": "Decentralized neutral support",
      "location": "Tsuruoka",
      "password": "OEyuwNg@1"
    }, {
      "firstName": "Pat",
      "lastName": "Polhill",
      "email": "ppolhill1n@vkontakte.ru",
      "age": 29,
      "bio": "Down-sized neutral concept",
      "location": "Hovorany",
      "password": "9WnReKEZsY@1"
    }, {
      "firstName": "Erny",
      "lastName": "Leaves",
      "email": "eleaves1o@lycos.com",
      "age": 36,
      "bio": "Public-key holistic Graphic Interface",
      "location": "Huashi",
      "password": "ApmuGePM@1"
    }, {
      "firstName": "Giustina",
      "lastName": "Snowding",
      "email": "gsnowding1p@g.co",
      "age": 58,
      "bio": "Enhanced actuating support",
      "location": "Bir Nabala",
      "password": "NMKajJ@1"
    }, {
      "firstName": "Tansy",
      "lastName": "Mantram",
      "email": "tmantram1q@is.gd",
      "age": 45,
      "bio": "Devolved object-oriented encryption",
      "location": "Krikil",
      "password": "QgIjYkaYUQ@1"
    }, {
      "firstName": "Haven",
      "lastName": "Gallamore",
      "email": "hgallamore1r@cargocollective.com",
      "age": 58,
      "bio": "Compatible multi-tasking pricing structure",
      "location": "Aghajari",
      "password": "bX5maKGoB5fb@1"
    }, {
      "firstName": "Milty",
      "lastName": "Allbon",
      "email": "mallbon1s@gnu.org",
      "age": 51,
      "bio": "Multi-lateral logistical challenge",
      "location": "Yevlakh",
      "password": "Ujmxgf36nXh@1"
    }, {
      "firstName": "Ferd",
      "lastName": "Cottham",
      "email": "fcottham1t@msu.edu",
      "age": 31,
      "bio": "Customizable systematic software",
      "location": "Minakuchi",
      "password": "3XHG9AxF@1"
    }, {
      "firstName": "Riki",
      "lastName": "Robilliard",
      "email": "rrobilliard1u@whitehouse.gov",
      "age": 38,
      "bio": "Enhanced eco-centric matrix",
      "location": "Kabin Buri",
      "password": "7oXfcjyyTsZ@1"
    }, {
      "firstName": "Robers",
      "lastName": "Pichan",
      "email": "rpichan1v@constantcontact.com",
      "age": 41,
      "bio": "Public-key bandwidth-monitored contingency",
      "location": "Sabang",
      "password": "WzuJdd9C@1"
    }, {
      "firstName": "Miguela",
      "lastName": "Glitherow",
      "email": "mglitherow1w@instagram.com",
      "age": 58,
      "bio": "Balanced non-volatile knowledge user",
      "location": "Puyo",
      "password": "TMCoN9SHTsuz@1"
    }, {
      "firstName": "Norman",
      "lastName": "Hodinton",
      "email": "nhodinton1x@reference.com",
      "age": 40,
      "bio": "Integrated impactful standardization",
      "location": "Little Rock",
      "password": "OAdbMmMXC@1"
    }, {
      "firstName": "Viviyan",
      "lastName": "Greasty",
      "email": "vgreasty1y@biblegateway.com",
      "age": 33,
      "bio": "User-friendly empowering conglomeration",
      "location": "Francisco Villa",
      "password": "w7TtFIJi@1"
    }, {
      "firstName": "Matteo",
      "lastName": "Padwick",
      "email": "mpadwick1z@google.co.jp",
      "age": 49,
      "bio": "Cloned bifurcated capacity",
      "location": "Lenghu",
      "password": "GJHtz4mPNf1@1"
    }, {
      "firstName": "Miller",
      "lastName": "Lardnar",
      "email": "mlardnar20@usa.gov",
      "age": 46,
      "bio": "Future-proofed optimal alliance",
      "location": "Tabalosos",
      "password": "IK5piRJmGVLu@1"
    }, {
      "firstName": "Carmelia",
      "lastName": "Elliker",
      "email": "celliker21@twitpic.com",
      "age": 25,
      "bio": "Face to face secondary attitude",
      "location": "Poxin",
      "password": "aGX50rTBF4@1"
    }, {
      "firstName": "Viviene",
      "lastName": "Boutcher",
      "email": "vboutcher22@digg.com",
      "age": 44,
      "bio": "Optimized background customer loyalty",
      "location": "Cabrela",
      "password": "57W7i9@1"
    },
    {
      "firstName": "Karney",
      "lastName": "Haywood",
      "email": "khaywoodt@hostgator.com",
      "age": 33,
      "bio": "Ergonomic high-level orchestration",
      "location": "Pregonero",
      "password": "J00t2wfbOk@1"
    }, {
      "firstName": "Veronique",
      "lastName": "Simko",
      "email": "vsimkou@jiathis.com",
      "age": 33,
      "bio": "Synergistic neutral standardization",
      "location": "San Carlos",
      "password": "qvK9g6PZ30jz@1"
    }, {
      "firstName": "Thain",
      "lastName": "Dayment",
      "email": "tdaymentv@squarespace.com",
      "age": 50,
      "bio": "Mandatory interactive workforce",
      "location": "Horodok",
      "password": "WpQg51B06qh@1"
    }, {
      "firstName": "Wallache",
      "lastName": "Cambell",
      "email": "wcambellw@youtu.be",
      "age": 35,
      "bio": "Open-source clear-thinking approach",
      "location": "Bialobrzegi",
      "password": "ItBQRxmeB@1"
    }, {
      "firstName": "Davidson",
      "lastName": "Mitroshinov",
      "email": "dmitroshinovx@github.com",
      "age": 31,
      "bio": "Intuitive scalable array",
      "location": "Jajawai",
      "password": "XTjZ2UY@1"
    }, {
      "firstName": "Sibbie",
      "lastName": "Sutherns",
      "email": "ssuthernsy@sciencedaily.com",
      "age": 52,
      "bio": "Organized high-level success",
      "location": "Skalanion",
      "password": "ChnP5gEh2@1"
    }, {
      "firstName": "Taddeo",
      "lastName": "Eastmond",
      "email": "teastmondz@cnet.com",
      "age": 38,
      "bio": "Implemented coherent database",
      "location": "Korenov",
      "password": "PgHGn8ZaEX@1"
    }, {
      "firstName": "Der",
      "lastName": "Northbridge",
      "email": "dnorthbridge10@disqus.com",
      "age": 23,
      "bio": "Operative global synergy",
      "location": "Puqi",
      "password": "yfO4Ho64wMG@1"
    }, {
      "firstName": "Nicola",
      "lastName": "Minchell",
      "email": "nminchell11@issuu.com",
      "age": 40,
      "bio": "Compatible global interface",
      "location": "Estrada",
      "password": "Sg4t2D@1"
    }, {
      "firstName": "Jakie",
      "lastName": "Blain",
      "email": "jblain12@blog.com",
      "age": 58,
      "bio": "Polarised value-added conglomeration",
      "location": "Solntsevo",
      "password": "HJGRNlm0ks!1"
    }, {
      "firstName": "Valaree",
      "lastName": "Ivanenko",
      "email": "vivanenko13@yellowpages.com",
      "age": 50,
      "bio": "Reactive full-range protocol",
      "location": "Longmen",
      "password": "oTGmR4R0qoNs@1"
    }, {
      "firstName": "Byrle",
      "lastName": "Fasham",
      "email": "bfasham14@google.com.br",
      "age": 50,
      "bio": "Advanced cohesive frame",
      "location": "Patzicia",
      "password": "AWYRezlYj1j@1"
    }, {
      "firstName": "Kare",
      "lastName": "Sharrard",
      "email": "ksharrard15@lulu.com",
      "age": 59,
      "bio": "Front-line upward-trending application",
      "location": "Haoba",
      "password": "mBIyB5j@1"
    }
  ];

  let userIdList = [];
  for (let i = 0; i < userList.length; i++) {
    let curr;
    let element = userList[i];
    try {
      curr = await users.createUser(element);
    } catch (error) {
      console.log(element.firstName, error);
    }
    userIdList.push(curr);
  }

  // seed teams
  let teamIdList = [];
  let teamList = [
    {
      teamName: "Pagac LLC",
      description :"Random Description",
      private :false,
      memberLimit : 6,
      ageMin : 22
    },
    {
      teamName: "Zamit",
      description: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
      private: true,
      memberLimit: 9,
      ageMin: 26
    }, {
      "teamName": "Wrapsafe",
      "description": "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
      "private": true,
      "memberLimit": 10,
      "ageMin": 54
    }, {
      "teamName": "Hatity",
      "description": "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
      "private": true,
      "memberLimit": 9,
      "ageMin": 51
    }, {
      "teamName": "Namfix",
      "description": "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
      "private": false,
      "memberLimit": 10,
      "ageMin": 29
    }, {
      "teamName": "Otcom",
      "description": "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
      "private": true,
      "memberLimit": 7,
      "ageMin": 53
    }, {
      "teamName": "Fintone",
      "description": "In congue. Etiam justo. Etiam pretium iaculis justo.",
      "private": true,
      "memberLimit": 4,
      "ageMin": 72
    }, {
      "teamName": "Job",
      "description": "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
      "private": true,
      "memberLimit": 10,
      "ageMin": 37
    }, {
      "teamName": "Hatity2",
      "description": "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
      "private": false,
      "memberLimit": 4,
      "ageMin": 38
    }, {
      "teamName": "Flowdesk",
      "description": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
      "private": false,
      "memberLimit": 7,
      "ageMin": 26
    }, {
      "teamName": "Regrant",
      "description": "In congue. Etiam justo. Etiam pretium iaculis justo.",
      "private": false,
      "memberLimit": 5,
      "ageMin": 34
    }, {
      "teamName": "Solarbreeze",
      "description": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
      "private": false,
      "memberLimit": 5,
      "ageMin": 76
    }, {
      "teamName": "Voyatouch",
      "description": "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
      "private": true,
      "memberLimit": 4,
      "ageMin": 35
    }, {
      "teamName": "Kanlam",
      "description": "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
      "private": true,
      "memberLimit": 6,
      "ageMin": 64
    }, {
      "teamName": "Sonsing",
      "description": "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",
      "private": true,
      "memberLimit": 8,
      "ageMin": 73
    }, {
      "teamName": "Stringtough",
      "description": "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
      "private": false,
      "memberLimit": 8,
      "ageMin": 43
    }, {
      "teamName": "It",
      "description": "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
      "private": true,
      "memberLimit": 7,
      "ageMin": 44
    }, {
      "teamName": "Daltfresh",
      "description": "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
      "private": true,
      "memberLimit": 7,
      "ageMin": 44
    }, {
      "teamName": "Bamity",
      "description": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
      "private": true,
      "memberLimit": 5,
      "ageMin": 71
    }, {
      "teamName": "Greenlam",
      "description": "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
      "private": true,
      "memberLimit": 8,
      "ageMin": 61
    }, {
      "teamName": "Y-find",
      "description": "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
      "private": false,
      "memberLimit": 9,
      "ageMin": 67
    }, {
      "teamName": "Transcof",
      "description": "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
      "private": true,
      "memberLimit": 7,
      "ageMin": 69
    }, {
      "teamName": "Konklux",
      "description": "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
      "private": false,
      "memberLimit": 4,
      "ageMin": 75
    }
  ];
  for (let i = 0; i < teamList.length; i++) {
    let element = teamList[i];
    let random = Math.floor(Math.random() * userIdList.length);
    element.creatorID = userIdList[random]._id;
    let curr;
    try {
      curr = await teams.createTeam(element.teamName, element.description, element.private,element.memberLimit,element.ageMin,element.creatorID);
    } catch (error) {
      console.log(element.teamName, error);
    }
    teamIdList.push(curr);
  }

  // seed posts
  let paragraphList = [
    "hello, join team and help build robot...",
    "Best team around for IoT!",
    "We want to make the next twitter!",
    "We want to make the next facebook!",
    "We want to make the next instagram!",
    "We would love some help with our project!",
    "Open-source, and open hearts!",
    "Ecommerce but open-source?",
    "We are looking for front-end developers!",
    "We are looking for back-end developers!",
    "We are looking for UI/UX designers!",
    "We are looking for data scientists!",
    "Big machine learning project, woohoo!",
    "We want to reinvent the music scene!",
    "just looking for friends...",
    "We are looking for software engineers, stat!",
  ];
  let postList = [];
  for (let i = 0; i < teamIdList.length; i++) {
    let element = teamIdList[i];
    let randomAge = Math.floor(Math.random() * 25);
    let randomMem = Math.floor(Math.random() * 100);
    let randomP = Math.floor(Math.random() * paragraphList.length);

    let post = {
      teamID: element._id,
      createdByID: element.creatorID,
      title: element.teamName,
      description: paragraphList[randomP],
      private: randomAge % 2 == 0 ? true : false,
      memberLimit: randomMem < 10 ? 10 : randomMem,
      ageMin: randomAge <= 16 ? 17 : randomAge,
    };
    postList.push(post);
  }

  for (let i = 0; i < postList.length; i++) {
    let element = postList[i];
    try {
      await posts.createPost(
        element.teamID,
        element.createdByID,
        element.title,
        element.description,
        element.private,
        element.memberLimit,
        element.ageMin
      );
    } catch (error) {
      console.log(element.title, error);
    }
  }

  // seed feed
  // titles to be randomly assigned to feed posts
  let titles = [
    "Looking for a team",
    "Looking for a project",
    "Looking for a job",
    "Anyone know how to do this?",
    "Teams focused on AI?",
    "What makes a true programmer?",
    "Hosting cool event!",
    "Looking to collab with other teams!",
    "Looking for a mentor!",
    "Cool project idea!",
    "Does anyone want to join my team?",
    "Found this really cool thing!",
  ];
  let feedIdList = [];
  let feedList = [
    {
      title: null,
      description: "In eleifend quam a odio.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Donec ut mauris eget massa tempor convallis.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Nam tristique tortor eu pede.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Morbi a ipsum. Integer a nibh. In quis justo.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "In blandit ultrices enim.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Maecenas pulvinar lobortis est.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vivamus tortor. Duis mattis egestas metus. Aenean fermentum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Nulla tellus. In sagittis dui vel nisl.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Phasellus sit amet erat.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Suspendisse potenti.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Integer ac neque. Duis bibendum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Phasellus sit amet erat.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Duis mattis egestas metus. Aenean fermentum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Aliquam non mauris. Morbi non lectus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description: "Ut tellus. Nulla ut erat id mauris vulputate elementum.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
      teamID: null,
      createdByID: null,
    },
    {
      title: null,
      description:
        "Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.",
      teamID: null,
      createdByID: null,
    },
  ];
  for (let i = 0; i < feedList.length; i++) {
    let randomTeam = Math.floor(Math.random() * teamIdList.length);
    let randomUser = Math.floor(Math.random() * userIdList.length);
    let randomTitle = Math.floor(Math.random() * titles.length);
    let element = feedList[i];
    element.title = titles[randomTitle];
    element.teamID = teamIdList[randomTeam]._id;
    element.createdByID = userIdList[randomUser]._id;
    let curr;
    try {
      curr = await feed.createFeed(
        element.title,
        element.description,
        element.teamID,
        element.createdByID
      );
    } catch (error) {
      console.log(element.title, error);
    }
    feedIdList.push(curr._id);
  }

  // seed teamItems
  let teamItemList = [
    {
      createdBy: "Diego",
      dateStart: "12/17/2022",
      dateEnd: "01/26/2023",
      title: "You Ain't Seen Nothin' Yet (Vous n'avez encore rien vu)",
      content: null,
      location: "North Carolina",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Dodie",
      dateStart: "12/17/2022",
      dateEnd: "01/11/2023",
      title: "First Texan, The",
      content: null,
      location: "Colorado",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Craig",
      dateStart: "12/17/2022",
      dateEnd: "01/16/2023",
      title: "Berserk: The Golden Age Arc - The Egg of the King",
      content: null,
      location: "Pennsylvania",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Piper",
      dateStart: "12/17/2022",
      dateEnd: "01/10/2023",
      title: "Too Early, Too Late (Trop tôt, trop tard)",
      content: null,
      location: "Ohio",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Pauletta",
      dateStart: "12/17/2022",
      dateEnd: "01/01/2023",
      title: "Remains of the Day, The",
      content: null,
      location: "Florida",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Travers",
      dateStart: "12/17/2022",
      dateEnd: "01/28/2023",
      title: "Night Nurse",
      content: null,
      location: "Pennsylvania",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Cris",
      dateStart: "12/17/2022",
      dateEnd: "01/17/2023",
      title: "Stacy's Knights",
      content: null,
      location: "Kentucky",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Kirsten",
      dateStart: "12/17/2022",
      dateEnd: "01/20/2023",
      title: "Serial Killer Culture",
      content: null,
      location: "Alaska",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Clarice",
      dateStart: "12/17/2022",
      dateEnd: "01/28/2023",
      title: "2:13",
      content: null,
      location: "Arizona",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Myriam",
      dateStart: "12/17/2022",
      dateEnd: "01/12/2023",
      title: "Lake City",
      content: null,
      location: "New York",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Ingar",
      dateStart: "12/17/2022",
      dateEnd: "01/05/2023",
      title: "Little Lord Fauntleroy",
      content: null,
      location: "Pennsylvania",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Hedda",
      dateStart: "12/17/2022",
      dateEnd: "01/29/2023",
      title: "We Stand Alone Together",
      content: null,
      location: "Texas",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Inglebert",
      dateStart: "12/17/2022",
      dateEnd: "01/12/2023",
      title: "Life After Tomorrow",
      content: null,
      location: "California",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Deck",
      dateStart: "12/17/2022",
      dateEnd: "01/03/2023",
      title: "One Man's Hero",
      content: null,
      location: "Colorado",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Valdemar",
      dateStart: "12/17/2022",
      dateEnd: "01/13/2023",
      title: "Get Rich or Die Tryin'",
      content: null,
      location: "Kansas",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Ivar",
      dateStart: "12/17/2022",
      dateEnd: "01/07/2023",
      title: "Stooge, The",
      content: null,
      location: "North Dakota",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Sumner",
      dateStart: "12/17/2022",
      dateEnd: "01/02/2023",
      title: "Winning",
      content: null,
      location: "Iowa",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Amaleta",
      dateStart: "12/17/2022",
      dateEnd: "01/17/2023",
      title: "Song of the South",
      content: null,
      location: "Nevada",
      done: true,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Binni",
      dateStart: "12/17/2022",
      dateEnd: "01/27/2023",
      title: "Long Riders, The",
      content: null,
      location: "Ohio",
      done: false,
      type: null,
      teamID: null,
    },
    {
      createdBy: "Euell",
      dateStart: "12/17/2022",
      dateEnd: "01/17/2023",
      title: "Class of 92, The",
      content: null,
      location: "Ohio",
      done: true,
      type: null,
      teamID: null,
    },
  ];
  let teamItemIdList = [];

  console.log("Done seeding database");

  await dbConnection.closeConnection();
}

main();
