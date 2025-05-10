import { Box, Boxes, Cone, Notebook, Pyramid } from "lucide-react";

export const projectIcons = [ 
    { 
        name : "Prism" , 
        icon : Pyramid
    }, 
    { 
        name : "Notebook" , 
        icon : Notebook
    },
    { 
        name : "Cube" , 
        icon : Box
    },
    { 
        name : "Cone" , 
        icon : Cone
    },
    { 
        name : "Boxes" , 
        icon : Boxes
    },

]


export type IconName = typeof projectIcons[number]["icon"]["name"]
