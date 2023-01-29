import os
import sys

virtualEnv = 'qtenv/bin/activate_this.py' if os.name == 'posix' \
     else 'qtenv\\Scripts\\activate_this.py'
virtualEnv = os.path.join(os.getcwd(), virtualEnv)
print(virtualEnv)
if sys.version_info.major < 3:
    execfile(virtualEnv, dict(__file__=virtualEnv))
else:
    exec(open(virtualEnv).read(), {'__file__': virtualEnv})

import PyQt5
import paraview.simple as pvsimple
from vtkmodules.qt.QVTKRenderWindowInteractor import QVTKRenderWindowInteractor


# Create a QtApp for the render widget. It prevents a popup window
App = PyQt5.QtWidgets.QApplication([])

file = os.path.join("serve_paraview", "test_pipe.csv")
render_view = pvsimple.CreateRenderView()
render_widget = QVTKRenderWindowInteractor(rw=render_view.GetRenderWindow(), iren=render_view.GetInteractor())

# Load the csv file to the view
c = pvsimple.CSVReader(FileName=file)
c = pvsimple.TableToPoints(Input=c)
c.XColumn = "Points:0"
c.YColumn = "Points:1"
c.ZColumn = "Points:2"
display = pvsimple.Show(c, render_view)
try:
    display.ColorArrayName = ['POINTS', "totdsp"]
    pvsimple.ColorBy(display, ('POINTS', "totdsp"))
except Exception as e:
    print(e)

# save the active view and close the widget
mv = pvsimple.GetActiveView()
tmp_file = "serve_paraview/pipe.vtkjs"
pvsimple.ExportView(tmp_file, mv)
render_widget.close()
