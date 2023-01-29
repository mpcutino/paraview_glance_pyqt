import os
import sys
import subprocess

from PyQt5 import QtCore
from PyQt5.QtWidgets import QApplication, QMainWindow

from ui.main_ui import Ui_Visual_MainWindow


class MainApp(QMainWindow, Ui_Visual_MainWindow):

    def __init__(self):
        QMainWindow.__init__(self)
        self.setupUi(self)
        self.btnTestGlance.clicked.connect(self.test_paraview)
    
    def test_paraview(self):
        self.setEnabled(False)
        # call a script with pvpython to create the file to serve in the application
        subprocess.run(['pvpython', 'pview_plot.py'])
        # once it finish, plot the resulting file
        url = QtCore.QUrl(self.get_url("pipe.vtkjs"))
        self.webWidget.load(url)
        self.setEnabled(True)
    
    @staticmethod
    def get_url(file):
        server_default = "0.0.0.0" if os.name == 'posix' else "localhost"
        app = f"http://{server_default}:8000/serve_paraview/glance"
        return app + "?name=" + file + "&url=../" + file


if __name__ == '__main__':
    App = QApplication(sys.argv)
    main_app = MainApp()
    main_app.show()
    
    # start the server for paraview
    sever_process = subprocess.Popen(["python", "-m", "http.server", "8000"])
    App.exec()
    # close the server before exiting...
    print("Ending server...")
    sever_process.kill()
