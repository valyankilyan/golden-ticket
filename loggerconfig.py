
import logging 
import logging.config

logging.config.fileConfig('.conf/logging.conf')

def getLogger(name):
    return logging.getLogger(name)