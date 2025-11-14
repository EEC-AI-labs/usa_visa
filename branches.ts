export interface Branch {
  '@type': 'EducationalOrganization';
  name: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  contactPoint: Array<{
    '@type': 'ContactPoint';
    contactType: string;
    telephone: string;
    url: string;
  }>;
  hasMap: string;
  geo: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  identifier: string;
}

export const BRANCH_DATA: Branch[] = [
    
  // Ahmedabad Branches
  {
    "@type": "EducationalOrganization",
    "name": "EEC Memnagar",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, Satya One, Opp. Manav Mandir, Helmet Circle, Memnagar, Ahmedabad",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758883889",
        "url": "https://wa.me/918758883889"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880310",
        "url": "https://wa.me/918758880310"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=10716909102676170971",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0454381,
      "longitude": 72.5401341
    },
    "identifier": "15"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Ghatlodiya",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3rd Floor, Shayona Sarvopari Shayona City, R.C. Technical Road Shayona City, Road, Ghatlodiya, Chanakyapuri, Ahmedabad,",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758880710",
        "url": "https://wa.me/918758880710"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880510",
        "url": "https://wa.me/918758880510"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=759408121446196888",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0785258,
      "longitude": 72.537403
    },
    "identifier": "16"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Chandkheda",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4th Floor, Sigma Arcade, Above Vijay Sales, Near Visat Circle, Chandkheda , Ahmedabad",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758750010",
        "url": "https://wa.me/918758750010"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758750010",
        "url": "https://wa.me/918758750010"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=6232741686974192347",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.1004343,
      "longitude": 72.5882111
    },
    "identifier": "17"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Maninagar",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4th Floor, Prism Building, Below Apple Cinema, Shah Alam Tolnaka, Kankaria, Ahmedabad.",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 7096083333",
        "url": "https://wa.me/917096083333"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880015",
        "url": "https://wa.me/918758880015"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=17011559568070196714",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0021655,
      "longitude": 72.5900043
    },
    "identifier": "18"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Odhav",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd floor, Kahan Commercial Complex, Sardar Patel Ring Rd, above Vijay Sales, Gokul Nagar, Adinath Nagar, Odhav, Ahmedabad",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758881885",
        "url": "https://wa.me/918758881885"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758881885",
        "url": "https://wa.me/918758881885"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=644558460884576515",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0198716,
      "longitude": 72.6711508
    },
    "identifier": "19"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Nikol",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3rd Floor, Suvas Scala, Opp. Nikol Police Station, Nikol, Ahmedabad",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758880700",
        "url": "https://wa.me/918758880700"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880700",
        "url": "https://wa.me/918758880700"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=12030682389519519650",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0436196,
      "longitude": 72.6770934
    },
    "identifier": "20"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Bapunagar",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, White House, India Colony Road, Opposite Swaminarayan Mandir,Ahmedabad",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758880320",
        "url": "https://wa.me/918758880320"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880390",
        "url": "https://wa.me/918758880390"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=14947997323335533677",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0386128,
      "longitude": 72.6288356
    },
    "identifier": "21"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Naroda",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, Sahitya Hills & Icon, Above Style Up Store, Muktidham Char Rasta, Vasant Vihar 2, Naroda, Ahmedabad",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758880730",
        "url": "https://wa.me/918758880730"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880730",
        "url": "https://wa.me/918758880730"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=5994096684006541649",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0755423,
      "longitude": 72.6652502
    },
    "identifier": "22"
  },

   // Surat Branches
   {
    "@type": "EducationalOrganization",
    "name": "EEC Parvat Patia (Dumbhal)",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "UG10, AMs, Shri Vardhan Textile Market Above Zudio & Opp. Samrat International School, Dumbhal, Surat",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758880210",
        "url": "https://wa.me/918758880210"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880210",
        "url": "https://wa.me/918758880210"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=547408908762340617",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.186862,
      "longitude": 72.8582719
    },
    "identifier": "7"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Mota Varrachha",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4th Floor, Opera Business Hub, Lajamni Chowk, Mota Varachha, Surat",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758750018",
        "url": "https://wa.me/918758750018"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880035",
        "url": "https://wa.me/918758880035"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=10998422264877093818",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.2380878,
      "longitude": 72.8887973
    },
    "identifier": "8"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Katargam",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, Neeru Farms, Rajhans Flamingo, Gajera Rd, Priya Park Society, Surat",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "",
        "url": "https://wa.me/91nan"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880630",
        "url": "https://wa.me/918758880630"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=518779354665221255",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.2362758,
      "longitude": 72.8223655
    },
    "identifier": "9"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Ghod Dod Road",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3rd Floor, Jade Blue Union Square, Ghod Dod Rd, Surat",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758757777",
        "url": "https://wa.me/918758757777"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758880170",
        "url": "https://wa.me/918758880170"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=2602505128606220636",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.1745977,
      "longitude": 72.8055221
    },
    "identifier": "10"
  },
  {
    "@type": "EducationalOrganization",
    "name": "EEC Vesu",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1st Floor, International Finance Centre, IFC, VIP Rd, Vesu, Surat",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Coaching Information",
        "telephone": "+91 8758750029",
        "url": "https://wa.me/918758750029"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Admission and Visa Information",
        "telephone": "+91 8758750029",
        "url": "https://wa.me/918758750029"
      }
    ],
    "hasMap": "https://www.google.com/maps?cid=10525220703274082506",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.1415388,
      "longitude": 72.7810183
    },
    "identifier": "11"
  },

  // Vadodara Branches
  {
      "@type": "EducationalOrganization",
      "name": "EEC Alkapuri",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3rd floor,B-Wing,Windsor Plaza, RC Dutt Rd, Alkapuri, Vadodara",
        "addressLocality": "Vadodara",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8000506539",
          "url": "https://wa.me/918000506539"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8000506542",
          "url": "https://wa.me/918000506542"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=4136602748211046777",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.3101102,
        "longitude": 73.1699795
      },
      "identifier": "1"
    },
    {
      "@type": "EducationalOrganization",
      "name": "EEC Nizampura",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Procube Complex, Nizampura Rd, above GSRTC Bus Station, Nizampura Main Road, Vadodara.",
        "addressLocality": "Vadodara",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758753333",
          "url": "https://wa.me/918758753333"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 9375974748",
          "url": "https://wa.me/919375974748"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=5231620757401386552",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.3396157,
        "longitude": 73.1787055
      },
      "identifier": "2"
    },
    {
      "@type": "EducationalOrganization",
      "name": "EEC Manjalpur",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Infinity Arcade Opposite Pratapnagar Police HQ ONGC Dairy Road, Manjalpur, Vadodara.",
        "addressLocality": "Vadodara",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758750037",
          "url": "https://wa.me/918758750037"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758884882",
          "url": "https://wa.me/918758884882"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=11809726738474800676",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.2790919,
        "longitude": 73.2060697
      },
      "identifier": "3"
    },
    {
      "@type": "EducationalOrganization",
      "name": "EEC New Vip Road",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Shree Siddheshwar Plaza, New VIP Rd, Sheshnarayan Society, Sardar Estate, Sayaji Park Society, Vadodara.",
        "addressLocality": "Vadodara",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758750040",
          "url": "https://wa.me/918758750040"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758880034",
          "url": "https://wa.me/918758880034"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=14735362156000599625",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.3150936,
        "longitude": 73.2321901
      },
      "identifier": "4"
    },


   

    // Anand Branches
    {
      "@type": "EducationalOrganization",
      "name": "EEC Vallabh Vidyanagar Anand",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1st Floor, Sigma Prime Complex, Above Royal Enfield, Sardar Patel Statue Circle, Janta Road, Vallabh Vidyanagar, Anand",
        "addressLocality": "Anand",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758882884",
          "url": "https://wa.me/918758882884"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758882884",
          "url": "https://wa.me/918758882884"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=3977509921364302622",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.545389,
        "longitude": 72.929261
      },
      "identifier": "6"
    },

     // Nadiad Branches
     {
      "@type": "EducationalOrganization",
      "name": "EEC Nadiad",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "4th Floor, Nexus 2, College Rd, opposite McDonalds, Nadiad",
        "addressLocality": "Nadiad",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758880010",
          "url": "https://wa.me/918758880010"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758880670",
          "url": "https://wa.me/918758880670"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=11482223323153504735",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.6725513,
        "longitude": 72.8846279
      },
      "identifier": "5"
    },

      // Himatnagar Branches
      {
        "@type": "EducationalOrganization",
        "name": "EEC Himatnagar",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2nd Floor, Platinum Square Building, opposite Post Office, Himatnagar",
          "addressLocality": "Himatnagar",
          "addressRegion": "Gujarat",
          "addressCountry": "India"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "Coaching Information",
            "telephone": "+91 8758750080",
            "url": "https://wa.me/918758750080"
          },
          {
            "@type": "ContactPoint",
            "contactType": "Admission and Visa Information",
            "telephone": "+91 8758880080",
            "url": "https://wa.me/918758880080"
          }
        ],
        "hasMap": "https://www.google.com/maps?cid=2830319800003816353",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 23.5978124,
          "longitude": 72.959008
        },
        "identifier": "24"
      },


       // Visnagar Branches
    {
      "@type": "EducationalOrganization",
      "name": "EEC Visnagar",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Above Shukan Restaurant Visnagar Kheralu Road, Visnagar",
        "addressLocality": "Visnagar",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758750086",
          "url": "https://wa.me/918758750086"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758750086",
          "url": "https://wa.me/918758750086"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=14409675891397590911",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 23.7068647,
        "longitude": 72.5391915
      },
      "identifier": "26"
    },

    
    // Mehsana Branches
    {
      "@type": "EducationalOrganization",
      "name": "EEC Mehsana",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Perfect Plaza, near Aayush Hospital, Radhanpur Road, Mehsana",
        "addressLocality": "Mehsana",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758880886",
          "url": "https://wa.me/918758880886"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758880069",
          "url": "https://wa.me/918758880069"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=17643646208083690976",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 23.6085135,
        "longitude": 72.3735012
      },
      "identifier": "25"
    },

    
    // Kalol Branches
    {
      "@type": "EducationalOrganization",
      "name": "EEC Kalol",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, above Raymond, near HDFC Bank, Navjivan Mill Compound, Memon Market, Kalol",
        "addressLocality": "Kalol",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758750090",
          "url": "https://wa.me/918758750090"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758750090",
          "url": "https://wa.me/918758750090"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=17127671789391534440",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 23.24262,
        "longitude": 72.5024925
      },
      "identifier": "23"
    },

     // Bharuch Branches
     {
      "@type": "EducationalOrganization",
      "name": "EEC Bharuch",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3rd Floor, Shalimar Complex, Above Reliance mart, Station road, Bharuch",
        "addressLocality": "Bharuch",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758884889",
          "url": "https://wa.me/918758884889"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758884889",
          "url": "https://wa.me/918758884889"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=520984728877884237",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.7010383,
        "longitude": 72.9913133
      },
      "identifier": "14"
    },



       // Navsari Branches
       {
        "@type": "EducationalOrganization",
        "name": "EEC Navsari",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "4th Floor, Sachi Arcade Opp. Prajapati Ashram, Khumbharwad, Navsari",
          "addressLocality": "Navsari",
          "addressRegion": "Gujarat",
          "addressCountry": "India"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "Coaching Information",
            "telephone": "+91 8758880055",
            "url": "https://wa.me/918758880055"
          },
          {
            "@type": "ContactPoint",
            "contactType": "Admission and Visa Information",
            "telephone": "+91 8758880055",
            "url": "https://wa.me/918758880055"
          }
        ],
        "hasMap": "https://www.google.com/maps?cid=14092899668333906838",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 20.9497099,
          "longitude": 72.9323178
        },
        "identifier": "13"
      },




    // Vapi Branches
    {
      "@type": "EducationalOrganization",
      "name": "EEC Vapi",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3rd Floor, EEC, iSquare Building, Daman Rd, opposite Axis Bank, Daulat Nagar,Vapi",
        "addressLocality": "Vapi",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Coaching Information",
          "telephone": "+91 8758880040",
          "url": "https://wa.me/918758880040"
        },
        {
          "@type": "ContactPoint",
          "contactType": "Admission and Visa Information",
          "telephone": "+91 8758880040",
          "url": "https://wa.me/918758880040"
        }
      ],
      "hasMap": "https://www.google.com/maps?cid=11741653787646363018",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 20.3879123,
        "longitude": 72.8987805
      },
      "identifier": "12"
    },

 

   

  

   
];