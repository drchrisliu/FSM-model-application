# A very simple Flask Hello World app for you to get started with...
# Load required modules
import pandas as pd
import scipy.spatial
import scipy.cluster
import numpy as np
import json
from functools import reduce
import matplotlib.pyplot as plt
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

from flask import Flask, request, jsonify

app = Flask(__name__)

def crossdomain(origin=None, methods=None, headers=None, max_age=21600,
                attach_to_all=True, automatic_options=True):
    """Decorator function that allows crossdomain requests.
      Courtesy of
      https://blog.skyred.fi/articles/better-crossdomain-snippet-for-flask.html
    """
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    # use str instead of basestring if using Python 3.x
    if headers is not None and not isinstance(headers, list):
        headers = ', '.join(x.upper() for x in headers)
    # use str instead of basestring if using Python 3.x
    if not isinstance(origin, list):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        """ Determines which methods are allowed
        """
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        """The decorator function
        """
        def wrapped_function(*args, **kwargs):
            """Caries out the actual cross domain code
            """
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

# Create a nested dictionary from the ClusterNode's returned by SciPy
def add_node(node, parent ):
    # First create the new node and append it to its parent's children
    newNode = dict( node_id=node.id, children=[] )
    parent["children"].append( newNode )

    # Recursively add the current node's children
    if node.left: add_node( node.left, newNode )
    if node.right: add_node( node.right, newNode )



# Label each node with the names of each leaf in its subtree
def label_tree( n, id2name ):
    # If the node is a leaf, then we have its name
    if len(n["children"]) == 0:
        leafNames = [ id2name[n["node_id"]] ]

    # If not, flatten all the leaves in the node's subtree
    else:
        leafNames = reduce(lambda ls, c: ls + label_tree(c, id2name), n["children"], [])

    # Delete the node id since we don't need it anymore and
    # it makes for cleaner JSON
    del n["node_id"]

    # Labeling convention: "-"-separated leaf names
    n["name"]  = "-".join(sorted(map(str, leafNames)))

    return leafNames

@app.route('/', methods=['POST','OPTIONS'])
@crossdomain(origin='*')
def hello_world():
    geneExp = request.get_json()
    # geneExp = None
    # Example data: gene expression
    if geneExp == None:
        geneExp = {'labels' : ['a', 'b', 'c', 'd', 'e', 'f'],
                'exp1': [-2.2, 5.6, 0.9, -0.23, -3, 0.1],
            'exp2': [5.4, -0.5, 2.33, 3.1, 4.1, -3.2]
                }
    df = pd.DataFrame( geneExp )

    # Determine distances (default is Euclidean)
    dataMatrix = np.array( df.drop('labels', axis=1) )
    distMat = scipy.spatial.distance.pdist( dataMatrix )

    # Cluster hierarchicaly using scipy
    clusters = scipy.cluster.hierarchy.linkage(distMat, method='single')
    T = scipy.cluster.hierarchy.to_tree( clusters , rd=False )

    # Create dictionary for labeling nodes by their IDs
    labels = list(df.labels)
    id2name = dict(zip(range(len(labels)), labels))

    # Draw dendrogram using matplotlib to scipy-dendrogram.pdf
    scipy.cluster.hierarchy.dendrogram(clusters, labels=labels, orientation='right')
    plt.savefig("./mysite/static/scipy-dendrogram.png")

    # Initialize nested dictionary for d3, then recursively iterate through tree
    d3Dendro = dict(children=[], name="Root1")
    add_node( T, d3Dendro )

    label_tree( d3Dendro["children"][0] , id2name)

    # response = request.get_data()
    response = jsonify(d3Dendro)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


