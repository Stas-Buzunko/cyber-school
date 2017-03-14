import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router';


class MainView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [
        {description: "1",
        main_photo:  "1",
        duration:  "1",
        price:  "1",
        lessons: [
          1: {
            video_link:  "1",
            description: "1",
            test: "ltest_id",
          }
        ]
      },
      {description: "2",
      main_photo:  "2",
      duration:  "2",
      price:  "2",
      lessons: [
        1: {
          video_link:  "2.1",
          description: "2.1",
          test: "ltest_id2.1",
        },
        2: {
          video_link:  "2.2",
          description: "2.2",
          test: "ltest_id2.2",
        }
      ]
    },
  ]
}
};
render() {

  const coursesList = this.state.courses.map((item, i) =>
  <li key={i}>
    <div>  description:   {item.description}</div>
    <div>  main_photo:   {item.main_photo}</div>
    <div>  duration:  {item.duration}</div>
    <div> price:   {item.price}</div>
    <div> lessons: </div>
    <ul>
      {item.lessons.map((lesson , k) =>
        <li key={k}>
          <div>{lesson}:</div>
          <ul>
            <div>video_link:{lesson.video_link}</div>
            <div>description:{lesson.description}</div>
            <div>test: {lesson.test}</div>
          </ul>
        </li>
      )
    }
  </ul>
  <button
    type="button"
    className="btn btn-primary lg"
    onClick={() => { browserHistory.push(`/admind/courses/:id/edit `)
    }}
    >Edit course</button>
  </li>
);
return (
  <div className="container">
    <div className="row">
      <div className="col-xs-6 col-md-4">

        <ul>
          {coursesList}
        </ul>
        <button
          type="button"
          className="btn btn-success lg"
          onClick={() => { browserHistory.push(`/admin/courses/new`)
          }}
          >Add course</button>
        </div>
      </div>
    </div>
  );
}
}

export default MainView;
