import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router';


class NewCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      main_photo:  "",
      duration:  "",
      price:  "",
      lessons: [
        {
          video_link:  "",
          descriptionLesson: "",
          test: "",
        }
      ]
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">

            <form className="form-horizontal">
              <div className="form-group">
                <label for="inputDescription" className="control-label col-xs-2">Description</label>
                <div className="col-xs-10">
                  <textarea  rows="10" cols="45" onChange={(e) => this.setState({description: e.target.value})} style={{border: '1px solid'}} />
                </div>
              </div>

              <div className="form-group">
                <label for="inputMainPhoto" className="control-label col-xs-2">Main photo</label>
                <div className="col-xs-10">
                  <input type="text" className="form-control" id="inputMainPhoto"/>
                </div>
              </div>

              <div className="form-group">
                <label  className="control-label col-xs-2">Duration</label>
                <div className="col-xs-10">
                  <input type="text" className="form-control" />
                </div>
              </div>

              <div className="form-group">
                <label for="input" className="control-label col-xs-2">Price</label>
                <div className="col-xs-10">
                  <input type="text" className="form-control"/>
                </div>
              </div>

              <div> lessons: </div>

              <div className="form-group">
                <label  className="control-label col-xs-2">Video link</label>
                <div className="col-xs-10">
                  <input type="text" className="form-control" />
                </div>
              </div>

              <div className="form-group">
                <label for="input" className="control-label col-xs-2">Description</label>
                <div className="col-xs-10">
                  <textarea  rows="10" cols="45" onChange={(e) => this.setState({descriptionLesson: e.target.value})} style={{border: '1px solid'}} />
                </div>
              </div>

              <div className="form-group">
                <label for="inputTest" className="control-label col-xs-2">Test</label>
                <div className="col-xs-10">
                  <input type="text" className="form-control"/>
                </div>
              </div>

            </form>

            <button
              type="button"
              className="btn btn-success lg"
              onClick={() => { browserHistory.push(`/admin/courses/new`)
              }}
              >Save course
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NewCourse;
