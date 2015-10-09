/*
    Draw a 3D object with triangular or rectangular faces.
    Faces are shaded based on their orientation to the light.
    
    *** The ordering of faces needs to be fixed ***
    
    Move shapes using translate3D(x, y, z, shape)
    Otherwise define faces counterclockwise.
    
    The object can be spun by clicking and dragging.
*/

// Move to centre of screen
translate(100, 200.5);
scale(1.4,1.4);
var rotateAngle = 2;
var faceColor = [100, 190, 20];
var lightVector = [1,-0.8,-2];
var edgeColour = color(43, 148, 48);

var translate3D = function(x, y, z, shape) {
  var nodes= shape.nodes;
  for (var i = 0; i < nodes.length; i+=1) {
    nodes[i] = [nodes[i][0]+x, nodes[i][1]+y, nodes[i][2]+z];
  }
};

var tortoise = {
    nodes: [[-103,0,0],[-95,20,0], [-95,-20,0],
            [-73,13,18],[-73,-13,18],[-60,20,24],[-60,-20,24],
            [-46,13,30],[-46,-13,30],[-32,20,32],[-32,-20,32],
            [-18,13,30],[-18,-13,30],[-4,20,24],[-4,-20,24],
            [9,13,18],[9,-13,18],[29,20,0],[29,-20,0],[37,0,0],
            [-81,38,0],[-60,43,0],[-46,46,0],[-32,47,0],
            [-18,46,0],[-4,43,0],[17,38,0],
            [-81,-38,0],[-60,-43,0],[-46,-46,0],[-32,-47,0],
            [-18,-46,0],[-4,-43,0],[17,-38,0],
            [-89,0,14],[-60,0,30],[-32,0,36],[-4,0,30],[23,0,14],
            [-76,27,18],[-76,-27,18],[-46,35,25],[-46,-35,25],
            [-18,35,25],[-18,-35,25],[10,27,18],[10,-27,18]],
            
    edges: [[0,1],[0,2],[1,3],[2,4],[3,4],
            [3,5],[4,6],[5,7],[6,8],[7,8],
            [7,9],[8,10],[9,11],[10,12],[11,12],
            [11,13],[12,14],[13,15],[14,16],[15,16],
            [15,17],[16,18],[17,19],[18,19],
            [1,20],[20,21],[21,5],[21,22],[22,23],[23,9],
            [23,24],[24,25],[25,13],[25,26],[26,17],
            [2,27],[27,28],[28,6],[28,29],[29,30],[30,10],
            [30,31],[31,32],[32,14],[32,33],[33,18]],
    
    faces: [[34,0,1],[34,1,3],[34,3,4],[34,4,2],[34,2,0],
    [35,3,5],[35,5,7],[35,7,8],[35,8,6],[35,6,4],[35,4,3],
    [36,8,7],[36,7,9],[36,9,11],[36,11,12],[36,12,10],[36,10,8],
    [37,12,11],[37,11,13],[37,13,15],[37,15,16],[37,16,14],[37,14,12],
    [38,16,15],[38,15,17],[38,17,19],[38,19,18],[38,18,16],
    [39,3,1],[39,1,20],[39,20,21],[39,21,5],[39,5,3],
    [40,2,4],[40,4,6],[40,6,28],[40,28,27],[40,27,2],
    [41,5,21],[41,21,22],[41,22,23],[41,23,9],[41,9,7],[41,7,5],
    [42,10,30],[42,30,29],[42,29,28],[42,28,6],[42,6,8],[42,8,10],
    [43,23,24],[43,24,25],[43,25,13],[43,13,11],[43,11,9],[43,9,23],
    [44,31,30],[44,30,10],[44,10,12],[44,12,14],[44,14,32],[44,32,31],
    [45,13,25],[45,25,26],[45,26,17],[45,17,15],[45,15,13],
    [46,14,16],[46,16,18],[46,18,33],[46,33,32],[46,32,14]]
};

var objects = [tortoise];

var subtractVectors = function(v1, v2){
    return [[v1[0] - v2[0]],
            [v1[1] - v2[1]],
            [v1[2] - v2[2]]];
};

var normaliseVector = function(v) {
    var d = sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
    return [v[0]/d, v[1]/d, v[2]/d];
};

var normalOfPlane = function(face, nodes) {
    var n1 = nodes[face[0]];
    var n2 = nodes[face[1]];
    var n3 = nodes[face[2]];
    
    var v1 = subtractVectors(n1, n2);
    var v2 = subtractVectors(n1, n3);
    
    var v3 = [[v1[1]*v2[2] - v1[2]*v2[1]],
              [v1[2]*v2[0] - v1[0]*v2[2]],
              [v1[0]*v2[1] - v1[1]*v2[0]]];
              
    return v3;
};

var dotProduct = function(v1, v2){
    // Assume everything has 3 dimensions
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
};

var currentX = false;
var currentY = false;

var rotateY3D = function(theta, nodes) {
    var ct = cos(theta);
    var st = sin(theta);
    var x, y, z;

    for (var i = 0; i < nodes.length; i+=1) {
        x = nodes[i][0];
        y = nodes[i][1];
        z = nodes[i][2];
        nodes[i] = [ct*x + st*z, y, -st*x + ct*z];
    }
};

var rotateX3D = function(theta, nodes){
    var ct = cos(theta);
    var st = sin(theta);
    var x, y, z;
    var obj;
    
    for (var i = 0; i < nodes.length; i+=1) {
        x = nodes[i][0];
        y = nodes[i][1];
        z = nodes[i][2];
        nodes[i] = [x, ct*y - st*z, st*y + ct*z];
    }
};

var sortFunction = function(a, b) {
    return a[0] - b[0];
};

lightVector = normaliseVector(lightVector);
rotateX3D(-2.5, tortoise.nodes);

var draw = function() {
    var i, o, f;
    var face;
    var faces = [];
    var nodes;
    var node1;
    var node2;
    
    rotateX3D(sin(frameCount*2)/4, tortoise.nodes);
    translate3D(0.2, 0 , 0, tortoise);
    
    background(255, 255, 255);

    for (o in objects) {
        var obj = objects[o];
        nodes = obj.nodes;
        
        if ('faces' in obj) {
            for (f in obj.faces) {
                face = obj.faces[f];
                var fnorm = normalOfPlane(face, nodes);
                
                if (fnorm[2] < 0) {
                    // Find order in which to draw faces
                    // by finding where it intersects the z-axis
                    var pos = dotProduct(fnorm, nodes[face[0]]);
                    
                    var fnodes;
                    if (face.length === 3) {
                        fnodes = [nodes[face[0]], nodes[face[1]],
                                  nodes[face[2]]];
                    } else {
                        fnodes = [nodes[face[0]], nodes[face[1]],
                                  nodes[face[2]], nodes[face[3]]];
                    }
                    
                    faces.push([pos / fnorm[2], fnorm, fnodes]);
                }
            }
        }
    }
    
    faces.sort(sortFunction);
    noStroke();
    for (f in faces) {
        face = faces[f];
        nodes = face[2];
        var l = dotProduct(lightVector, normaliseVector(face[1]));   
        fill(l * faceColor[0], l * faceColor[1], l * faceColor[2]);
        
        if (face[2].length === 3) {
            triangle(nodes[0][0], nodes[0][1],
                     nodes[1][0], nodes[1][1],
                     nodes[2][0], nodes[2][1]);
        } else {
            quad(nodes[0][0], nodes[0][1],
                 nodes[1][0], nodes[1][1],
                 nodes[2][0], nodes[2][1],
                 nodes[3][0], nodes[3][1]);
        }
    }
    
    /*
    stroke(8, 89, 11);
    for (o in objects) {
        if ('edges' in objects[o]) {
            var edges = objects[o].edges;
            nodes = objects[o].nodes;
            
            for (i = 0; i < edges.length; i++) {
                node1 = nodes[edges[i][0]];
                node2 = nodes[edges[i][1]];
                line(node1[0], node1[1], node2[0], node2[1]);
            }
        }
    }
    */

    if (mouseIsPressed) {
        if (currentX !== false) {
            var theta1 = -(currentX - mouseX) * PI / 10;
            var theta2 = (currentY - mouseY) * PI / 10;
            
            for (o in objects) {
                nodes = objects[o].nodes;
                rotateY3D(theta1, nodes);
                rotateX3D(theta2, nodes);    
            }
        }
        currentX = mouseX;
        currentY = mouseY;
    } else {
        currentX = false;
    }
};

var mouseOut = function(){
    mouseIsPressed = false;
};

var keyPressed = function() {
    var f = 0;
    var d = 0;
    if (keyCode === LEFT) {
        f = rotateY3D;
        d = 2;
    } else if (keyCode === RIGHT) {
        f = rotateY3D;
        d = -2;
    } else if (keyCode === UP) {
        f = rotateX3D;
        d = -2;
    } else if (keyCode === DOWN) {
        f = rotateX3D;
        d = 2;
    }
    
    if (f !== 0) {
        for (var obj in objects) {
                f(d, objects[obj].nodes); 
        }
    }
    
};