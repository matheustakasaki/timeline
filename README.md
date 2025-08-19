# Timeline Component

This project implements a draggable and resizable timeline component in React.  
It is designed to resemble a production-ready feature while still being simple enough to extend and customize.

---

## What I like about my implementation
I liked that the result feels very close to something that could actually be launched into production, both in terms of the idea behind the component and the way it works.

---

## What I would change if I were going to do it again
I would modify the drag-and-drop feature and make the lanes behave like draggable intervals — similar to vector elements in Figma or Canva.  
That would make the interaction feel more natural and flexible.
I would also improve the zoom functionality and the visual design of the component.

---

## How I made my design decisions
At first, I needed something concrete to use as a reference. I explored multiple examples until I had a clearer "big-picture" vision of what I wanted.  

This demo was especially helpful in shaping my approach:  
👉 https://demo.mobiscroll.com/react/timeline/month-view#

I also used these other references as inspiration:  
- https://codesandbox.io/p/sandbox/horizontal-timeline-w1rfc?file=%2Fsrc%2FApp.js  
- https://flowbite-react.com/docs/components/timeline  

---

## How I would test this if I had more time
If I had more time, I would implement unit and integration tests for the component.  

- **Unit tests** could validate date calculations (e.g., resizing start/end dates, moving items across days).  
- **Integration tests** could simulate user interactions (dragging, resizing, renaming) using a tool like [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).  
- I would also add **snapshot tests** to ensure the component renders consistently after changes.  

This would help guarantee that future modifications don’t break existing functionality.
