import * as fs from 'fs';
import * as path from 'path';
import {
  BREAK_DATA_PATH,
  DATA_PATH,
  EXERCISE_DATA_PATH,
  MUSCLE_DATA_PATH,
  MUSCLE_EXERCISE_DATA_PATH,
  VARIATION_DATA_PATH,
  WORKOUT_DATA_PATH,
  WORKOUT_MUSCLE_DATA_PATH,
  YOGA_DATA_PATH
} from "utils/Constants";


export class InitDBService {
    private dirPath: string;
    private workoutPath: string;
    private exercisePath: string;
    private musclePath: string;
    private muscleExercisePath: string;
    private workoutMusclePath: string;
    private breakPath: string;
    private variationPath: string;
    private yogaPath: string;

    constructor(dirPath: string) {
        this.dirPath = dirPath + DATA_PATH;
        this.workoutPath = dirPath + WORKOUT_DATA_PATH;
        this.exercisePath = dirPath + EXERCISE_DATA_PATH;
        this.musclePath = dirPath + MUSCLE_DATA_PATH;
        this.muscleExercisePath = dirPath + MUSCLE_EXERCISE_DATA_PATH;
        this.workoutMusclePath = dirPath + WORKOUT_MUSCLE_DATA_PATH;
        this.breakPath = dirPath + BREAK_DATA_PATH;
        this.variationPath = dirPath + VARIATION_DATA_PATH;
        this.yogaPath = dirPath + YOGA_DATA_PATH;
    }

    private ensureDirectoryExists() {
        if (!fs.existsSync(this.dirPath)) {
            fs.mkdirSync(this.dirPath, { recursive: true });
        }
    }

    private ensureFileExists(dataPath: string, defaultData: any) {
        // Ensure the file exists and write default data if it doesn't
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), 'utf8');
        } else if (fs.lstatSync(dataPath).isDirectory()) {
            throw new Error(`Cannot create file because a directory exists at: ${dataPath}`);
        }
    }    
  
 
    public initializeFiles() {
        this.ensureDirectoryExists();

        // Initialize only files that have default data
        this.ensureFileExists(this.breakPath, DEFAULT_BREAK_DATA);
        this.ensureFileExists(this.exercisePath, DEFAULT_EXERCISE_DATA);
        this.ensureFileExists(this.musclePath, DEFAULT_MUSCLE_DATA);
        this.ensureFileExists(this.muscleExercisePath, DEFAULT_MUSCLE_EXERCISE_DATA);
        this.ensureFileExists(this.workoutMusclePath, DEFAULT_WORKOUT_MUSCLE_DATA);
        this.ensureFileExists(this.variationPath, DEFAULT_VARIATION_DATA);
        this.ensureFileExists(this.yogaPath, DEFAULT_YOGA_DATA);
    
        // Optional or empty file initialization
        if (!fs.existsSync(this.workoutPath)) {
            fs.writeFileSync(this.workoutPath, JSON.stringify([], null, 2), 'utf8');
        }
    }
}    


// Default data for each file
const DEFAULT_BREAK_DATA = [
    "# 🚀 **BASICS SUPERSET BURNOUT** 💥\n\n**🔥 Instructions:** \n\n1. **10 Pullups** ➔ **10 Dips** ➔ **10 Pushups**\n2. **9 Pullups** ➔ **9 Dips** ➔ **9 Pushups**\n3. **8 Pullups** ➔ **8 Dips** ➔ **8 Pushups**\n4. **…until you reach ZERO!** 🎯\n\n### **Hope you struggle** 😊\n\n\n- [ ] **Completed:** No ❌ <!-- id: break -->",
    "# 🎥 **10 Reps of Each Exercise**\n\nPerform **10 reps** for each exercise from the video: [**Watch Here**](https://www.youtube.com/watch?v=a9qOLQFmTXE).\n\n👉 **Add the exercises you like** to your exercises list.\n\n\n- [ ] **Completed:** No ❌ <!-- id: break -->",
    "# **Go See ✨ Physiotherapist ✨**\n\n**For shin splints or anything else that hurts at the moment:**\nSucks to take care of your health doesn't it.\nCouldn't be me. 💅\n\n\n- [ ] **Completed:** No ❌ <!-- id: break -->",
    "# 🌟 **5 Sets of Complimenting Strangers**\n\n1. **Compliment a stranger you encounter today.** 😊\n2. **Find another stranger and offer a genuine compliment.** 🌟\n3. **Give a compliment to someone you’ve never met before.** 👍\n4. **Share a positive remark with a new face.** 👏\n5. **Make a stranger’s day by giving them a sincere compliment.** 💖\n\n\n- [ ] **Completed:** No ❌ <!-- id: break -->",
    "# 🗿 **Statue**\n\n. ## Stand in one place for 10min. \n Every time you move, timer restarts. \n\n### Learn to stand your ground\n\n\n- [ ] **Completed:** No ❌ <!-- id: break -->",
    "# **Bike 100km** 🚵\n\nPick a destination\n\n## and ride into the sunset 🌅\n\n\n- [ ] **Completed:** No ❌ <!-- id: break -->"
  ];

  const DEFAULT_YOGA_DATA = [
    "https://www.youtube.com/watch?v=iY-rGdoLX_8",
    "https://www.youtube.com/watch?v=lbElK4wUZJA",
    "https://www.youtube.com/watch?v=CJLDkGC4FxM",
    "https://www.youtube.com/watch?v=qYTUGCDj8Y0",
    "https://www.youtube.com/watch?v=D1CBQTCSDvY",
    "https://www.youtube.com/watch?v=eWCe_KE-l5o",
    "https://www.youtube.com/watch?v=Pt3mQT8vsQA",
    "https://www.youtube.com/watch?v=BieNFcV8Uw8",
    "https://www.youtube.com/watch?v=KpN2DkU4DN8"
  ];

  const DEFAULT_EXERCISE_DATA = [
    {
      "name": "run",
      "id": "run",
      "weight": 0,
      "sets": 1,
      "reps": "",
      "time": 0,
      "note": "🌳🌳🏃💨🌲🌳🌲🚴‍♂️🌲🌳🌳",
      "variation": "",
      "isSuccess": false,
      "isCompleted": false,
      "isUnlocked": true,
      "weightIncrease": 10,
      "boosted": null
    },
    {
      "name": "curls",
      "id": "curls",
      "weight": 30,
      "sets": 3,
      "reps": "5",
      "time": 48,
      "note": "",
      "variation": "",
      "isSuccess": false,
      "isCompleted": false,
      "isUnlocked": true,
      "weightIncrease": 10,
      "boosted": null
    },
    {
      "name": "triceps over head",
      "id": "triceps-over-head",
      "weight": 30,
      "sets": 3,
      "reps": "10-12",
      "time": 40,
      "note": "",
      "variation": "",
      "isSuccess": false,
      "isCompleted": false,
      "isUnlocked": true,
      "weightIncrease": 10,
      "boosted": null
    },
    {
      "name": "handstand",
      "id": "handstand",
      "weight": 0,
      "sets": 1,
      "reps": "5",
      "time": 48,
      "note": "",
      "variation": "wall assisted handstand kick-up",
      "isSuccess": false,
      "isCompleted": true,
      "isUnlocked": true,
      "weightIncrease": 0,
      "boosted": null
    },
    {
      "name": "chin up",
      "id": "chin-up",
      "weight": 0,
      "sets": 2,
      "reps": "5",
      "time": 30,
      "note": "",
      "variation": "",
      "isSuccess": false,
      "isCompleted": false,
      "isUnlocked": false,
      "weightIncrease": 5,
      "boosted": null
    }
  ];

  const DEFAULT_MUSCLE_DATA = [
    {
      "name": "cardio",
      "minSets": 0,
      "maxSets": 0,
      "boosted": 0,
      "coreExercises": [
        "run"
      ],
      "warmUps": []
    },
    {
      "name": "biceps",
      "minSets": 4,
      "maxSets": 6,
      "boosted": 1,
      "coreExercises": [
        "curls"
      ],
      "warmUps": [
        {
          "name": "curls",
          "id": "curls",
          "weight": 5,
          "sets": 1,
          "reps": "10-12",
          "time": 30,
          "note": "",
          "variation": "",
          "isSuccess": false,
          "isCompleted": false,
          "isUnlocked": false,
          "weightIncrease": 10,
          "boosted": 0
        },
        {
          "name": "curls again",
          "id": "curls-again",
          "weight": 10,
          "sets": 1,
          "reps": "10-12",
          "time": 30,
          "note": "",
          "variation": "",
          "isSuccess": false,
          "isCompleted": false,
          "isUnlocked": false,
          "weightIncrease": 10,
          "boosted": 0
        }
      ]
    },
    {
      "name": "tricep",
      "minSets": 4,
      "maxSets": 6,
      "boosted": 1,
      "coreExercises": [
        "triceps-over-head"
      ],
      "warmUps": [
        {
          "name": "Knee Push Up",
          "id": "knee-push-up",
          "weight": 0,
          "sets": 1,
          "reps": "15-20",
          "time": 30,
          "note": "",
          "variation": "",
          "isSuccess": false,
          "isCompleted": false,
          "isUnlocked": false,
          "weightIncrease": 10,
          "boosted": 0
        },
        {
          "name": "Band Triceps",
          "id": "band-triceps",
          "weight": 0,
          "sets": 1,
          "reps": "12-15",
          "time": 30,
          "note": "",
          "variation": "",
          "isSuccess": false,
          "isCompleted": false,
          "isUnlocked": false,
          "weightIncrease": 10,
          "boosted": 0
        }
      ]
    }
  ];

  const DEFAULT_MUSCLE_EXERCISE_DATA = [
    {
      "muscle": "cardio",
      "exercises": [
        {
          "name": "run"
        }
      ]
    },
    {
      "muscle": "biceps",
      "exercises": [
        {
          "name": "curls"
        },
        {
          "name": "chin-up"
        }
      ]
    },
    {
      "muscle": "tricep",
      "exercises": [
        {
          "name": "dips"
        },
        {
          "name": "handstand"
        },
        {
          "name": "triceps-over-head"
        }
      ]
    }
  ];

  const DEFAULT_WORKOUT_MUSCLE_DATA = [
    {
      "workout": "break",
      "muscles": []
    },
    {
      "workout": "cardio",
      "muscles": [
        {
          "name": "cardio"
        }
      ]
    },
    {
      "workout": "arms",
      "muscles": [
        {
          "name": "biceps"
        },
        {
          "name": "tricep"
        }
      ]
    }
  ];

  const DEFAULT_VARIATION_DATA = [
  {
    "exercise": "handstand",
    "variations": [
      {
        "name": "handstand",
        "next": [
          "push up to feet on wall"
        ]
      },
      {
        "name": "push up to feet on wall",
        "next": [
          "walk on wall"
        ]
      },
      {
        "name": "walk on wall",
        "next": [
          "walk on wall to handstand"
        ]
      },
      {
        "name": "walk on wall to handstand",
        "next": [
          "triangle handstand feet on ground"
        ]
      },
      {
        "name": "triangle handstand feet on ground",
        "next": [
          "triangle handstand feet off ground"
        ]
      },
      {
        "name": "triangle handstand feet off ground",
        "next": [
          "triangle handstand tuck heels to glutes"
        ]
      },
      {
        "name": "triangle handstand tuck heels to glutes",
        "next": [
          "triangle handstand extend hips"
        ]
      },
      {
        "name": "triangle handstand extend hips",
        "next": [
          "triangle handstand heels above hips"
        ]
      },
      {
        "name": "triangle handstand heels above hips",
        "next": [
          "triangle handstand hold"
        ]
      },
      {
        "name": "triangle handstand hold",
        "next": [
          "triangle handstand tuck ups"
        ]
      },
      {
        "name": "triangle handstand tuck ups",
        "next": [
          "triangle handstand straddle"
        ]
      },
      {
        "name": "triangle handstand straddle",
        "next": [
          "triangle handstand split legs"
        ]
      },
      {
        "name": "triangle handstand split legs",
        "next": [
          "crow wiggle"
        ]
      },
      {
        "name": "crow wiggle",
        "next": [
          "wall assisted handstand kick-up"
        ]
      },
      {
        "name": "wall assisted handstand kick-up",
        "next": [
          "forearm handstand pike-up"
        ]
      },
      {
        "name": "forearm handstand pike-up",
        "next": [
          "handstand on wall"
        ]
      },
      {
        "name": "handstand on wall",
        "next": [
          "handstand"
        ]
      },
      {
        "name": "handstand",
        "next": [
          "15s hold (shoulder focus)"
        ]
      },
      {
        "name": "15s hold (shoulder focus)",
        "next": [
          "freestanding straddle up"
        ]
      },
      {
        "name": "freestanding straddle up",
        "next": [
          "straddle jump up"
        ]
      },
      {
        "name": "straddle jump up",
        "next": [
          "60s hold (form focus)"
        ]
      },
      {
        "name": "60s hold (form focus)",
        "next": [
          "handstand look at feet"
        ]
      },
      {
        "name": "handstand look at feet",
        "next": [
          "knuckle assisted hold (30s)"
        ]
      },
      {
        "name": "knuckle assisted hold (30s)",
        "next": [
          "shift to fingertip"
        ]
      },
      {
        "name": "shift to fingertip",
        "next": [
          "1 finger shifts"
        ]
      },
      {
        "name": "1 finger shifts",
        "next": []
      }
    ]
  }
]
  