import React from "react";
import './App.css';

function App () {
  return (
      <div style={{height: "100vh"}}>
        <SplitView>
          <SplitPanel width={"20%"}>あああ</SplitPanel>
          <SplitPanel width={"60%"}>いいい</SplitPanel>
          <SplitPanel width={"20%"}>ううう</SplitPanel>
        </SplitView>
      </div>
  );
}

class SplitView extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      offsets: new Array (2 * this.props.children.length - 1).fill (0),
      parentWidth: 0
    };
    this.draggingIndex = -1;
    this.oldMousePosition = -1;

    this.startDragging = this.startDragging.bind (this);
    this.continueDragging = this.continueDragging.bind (this);
    this.stopDragging = this.stopDragging.bind (this);
  }

  // パネル幅を変更
  resize (index, delta) {
    const offsets = [...this.state.offsets];
    offsets[index - 1] += delta;
    offsets[index + 1] -= delta;
    this.setState ({offsets: offsets});
  }

  // ドラッグ開始
  startDragging (startMousePosition, index) {
    this.draggingIndex = index;
    this.oldMousePosition = startMousePosition;
  }

  // ドラッグ継続
  continueDragging (e) {
    if (this.draggingIndex >= 0) {
      const delta = e.pageX - this.oldMousePosition;
      this.resize (this.draggingIndex, delta);
      this.oldMousePosition = e.pageX;
    }
  }

  // ドラッグ終了
  stopDragging () {
    this.draggingIndex = -1;
    this.oldMousePosition = -1;
  }

  render () {
    const style = {
      display: "flex",
      height: "100%"
    };

    // SplitSeparatorを挿入
    const elements = [];
    let keyCounter = 0;
    for (let i = 0; i < this.props.children.length - 1; i++) {
      elements.push (React.cloneElement (this.props.children[i], {
        offset: this.state.offsets[keyCounter],
        key: keyCounter,
      }));
      keyCounter++;
      elements.push (<SplitSeparator key={keyCounter} index={keyCounter} parent={this}/>);
      keyCounter++;
    }
    elements.push (React.cloneElement (this.props.children[this.props.children.length - 1], {
      offset: this.state.offsets[keyCounter],
      key: keyCounter,
    }));

    return (
        <div style={style}
             onMouseMove={this.continueDragging} onMouseUp={this.stopDragging} onMouseLeave={this.stopDragging}>
          {elements}
        </div>
    );
  }
}

class SplitPanel extends React.Component {
  render () {
    const style = {
      width: `calc(${this.props.width} + ${this.props.offset}px)`,
      height: "100%",
    }

    return (
        <div style={style}>{this.props.children}</div>
    );
  }
}

class SplitSeparator extends React.Component {
  constructor (props) {
    super (props);

    this.onMouseDown = this.onMouseDown.bind (this);
  }

  onMouseDown (e) {
    this.props.parent.startDragging (e.pageX, this.props.index);
  }

  render () {
    const style = {
      width: "4px",
      height: "100%",
      backgroundColor: "lightgray",
      cursor: "col-resize"
    };

    return (
        <div style={style} onMouseDown={this.onMouseDown}></div>
    );
  }
}

export default App;
